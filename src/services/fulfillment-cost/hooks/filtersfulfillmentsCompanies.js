// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common');
const { NotAcceptable, NotFound } = require('@feathersjs/errors');
const calculateVolume = require('../../../hooks/calculate-volume');
const calculateDataFulfillmentCompany = require('../../../hooks/calculateDataFulfillmentCompany');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const records = getItems(context);

    const { user } = context.params;
    const { address_id, shopping_cart_id } = context.params.query;

    if (!address_id)
      throw new NotAcceptable(
        'Debes enviar el id de la direccion del usuario.'
      );

    if (!shopping_cart_id)
      throw new NotAcceptable('Debes enviar el id del carro de compras.');

    const [address, shoppingCart] = await Promise.all([
      context.app
        .service('addresses')
        .getModel()
        .findOne({
          include: [
            { association: 'city', attributes: ['id', 'dane_code'] },
          ],
          where: {
            id: address_id,
            user_id: user.id,
          }
        }),
      context.app
        .service('shopping-cart')
        .getModel()
        .query()
        .where({
          id: shopping_cart_id,
          user_id: user.id,
          deletedAt: null,
          status: 'active',
        })
        .then((it) => it[0]),
    ]);

    if (!address) throw new NotFound('No se encontró la dirección.');
    if (!shoppingCart)
      throw new NotFound('No se encontró el carro de compras.');

    const pack = await context.app
      .service('shopping-cart-details')
      .getModel()
      .query()
      .select(
        'shopping_cart_details.*',
        'shopping_cart_details.id AS shopping_cart_id',
        'shopping_cart_details.quantity AS product_quantity',
        'products.*',
        'products.id AS product_id'
      )
      .innerJoin(
        'products',
        'products.id',
        '=',
        'shopping_cart_details.product_id'
      )
      .where({
        shopping_cart_id: shoppingCart.id,
        'shopping_cart_details.deletedAt': null,
      })
      .then((it) => it);

    let { totalWeight, heigh, width, long, declared_value } =
      await calculateDataFulfillmentCompany({
        pack,
      })(context);

    const volume = await calculateVolume({ heigh, long, width })(context);

    const fulfillmentCompanies = await context.app
      .service('fulfillment-cities')
      .getModel()
      .query()
      .select(
        'fulfillment_company.*',
        'fulfillment_cities.*',
        'fulfillment_company.id AS fulfillment_company_id'
      )
      .innerJoin(
        'fulfillment_company',
        'fulfillment_cities.fulfillment_company_id',
        '=',
        'fulfillment_company.id',
      )
      .where({
        location_city_id: address.city_id,
        'fulfillment_company.status': 'active',
        'fulfillment_company.deletedAt': null,
        'fulfillment_cities.deletedAt': null
      });

    let response = [];
    for (const key in fulfillmentCompanies) {
      const company = fulfillmentCompanies[key];

      const matrix = await context.app
        .service('fulfillment-matrix')
        .getModel()
        .query()
        .where({
          fulfillment_company_id: company.fulfillment_company_id,
          deletedAt: null,
        })
        .then((it) => it[0]);

      if (matrix) {
        const fulfillmentMatrix = await context.app
          .service('fulfillment-matrix')
          .getModel()
          .query()
          // .select("fulfillment_matrix.*", "locations_cities.name AS city_name")
          .innerJoin(
            'locations_cities',
            'fulfillment_matrix.destination_city_id',
            '=',
            'locations_cities.id'
          )
          .where({
            fulfillment_company_id: company.fulfillment_company_id,
            type: 'weight',
            dane_code: address.city.dane_code,
          })
          .where('min', '<=', totalWeight)
          .where('max', '>=', totalWeight)
          .then((it) => it[0]);

        if (fulfillmentMatrix) fulfillmentMatrix.fulfillmentCompany = company;
        response.push(fulfillmentMatrix);
      } else {
        if (company.fulfillment_company_id == 2) {
          let servicesCodes = [];

          if (totalWeight > 9) {
            servicesCodes.push(2, 3);
          }
          if (totalWeight < 9) {
            servicesCodes.push(12, 13);
          }

          const quote = [];
          let sendDescription = null;
          for (const key in servicesCodes) {
            const code = servicesCodes[key];
            if (code == 3 || code == 12) {
              sendDescription = 'Terrestre';
            } else sendDescription = 'Aereo';
            quote.push(
              await context.app.service('envia-colvanes').create({
                action: 'find',
                destination_city: `${address.city.dane_code}`,
                city_origin: '08001',
                weight: totalWeight,
                volume,
                number_of_units: 1,
                declared_value,
                service_code: code,
                sendDescription: sendDescription,
              })
            );
          }

          if (quote.status == 'success') {
            quote.city_name = address.city_name;
            quote.destination_city_dane = address.city.dane_code;
            quote.price = quote.valor_costom + quote.valor_flete;
            quote.fulfillmentCompany = company;
          }

          response.push(
            ...quote.map((it) => ({
              ...it,
              city_name: address.city_name,
              destination_city_dane: address.city.dane_code,
              price: it.valor_costom + it.valor_flete,
              fulfillmentCompany: company,
            }))
          );
        }
      }
    }

    context.result = response;

    replaceItems(context, records);

    return context;
  };
};
