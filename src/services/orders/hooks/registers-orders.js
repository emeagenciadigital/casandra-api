// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require('feathers-hooks-common');
const { NotFound, NotAcceptable } = require('@feathersjs/errors');
const calculateDataFulfillmentCompany = require('../../../hooks/calculateDataFulfillmentCompany');
const calculateVolume = require('../../../hooks/calculate-volume');
const verifyDiscount = require('../../discounts/utils/verify');
const { getProductPrices } = require('../../../utils/price-list/prices');

module.exports = function () {
  return async (context) => {
    checkContext(context, null, ['create']);

    const { user } = context.params;

    const records = getItems(context);

    const shoppingCart = await context.app
      .service('shopping-cart')
      .getModel()
      .query()
      .where({ user_id: user.id, deletedAt: null, status: 'active' })
      .then((it) => it[0]);

    if (!shoppingCart)
      throw new NotFound('No se encontrĂ³ el carro de compras.');

    const shoppingCartDetails = await context.app
      .service('shopping-cart-details')
      .getModel()
      .query()
      .select(
        '*',
        'products.name AS product_name',
        'shopping_cart_details.id AS shopping_cart_details_id',
        'shopping_cart_details.quantity AS shopping_cart_details_quantity',
        'tax_rule.value AS tax_value',
        'tax_rule.id AS tax_id',
        'tax_rule.name AS tax_name',
        'products.*',
        'products.id AS product_id',
        context.app.get('knex').raw(`(
                SELECT products_media.path
                FROM products_media
                WHERE
                  products_media.product_id = products.id
                  AND products_media.deletedAt IS NULL
                ORDER BY products_media.priority DESC
                LIMIT 1
              ) AS product_main_image`)
      )
      .innerJoin(
        'products',
        'shopping_cart_details.product_id',
        '=',
        'products.id'
      )
      .leftJoin('tax_rule', 'products.tax_rule_id', '=', 'tax_rule.id')
      .where({
        shopping_cart_id: shoppingCart.id,
        'shopping_cart_details.deletedAt': null,
        'products.deletedAt': null,
        'products.status': 'active',
      })

    const requireShipping = shoppingCartDetails.some(it => it.course === 'false')

    const where = records.address_id
      ? { id: records.address_id, user_id: user.id }
      : { user_id: user.id, main: 'true' }

    const address = await context.app
      .service('addresses')
      .getModel()
      .findOne({
        include: [
          { association: 'city', },
          { association: 'state' },
        ],
        where
      })

    if (!address && requireShipping) throw new NotFound('No se encontrĂ³ la direcciĂ³n.');

    //activar cuando se configuren los poligonos

    const shippingCost = requireShipping
      ? await context.app
        .service('search-shipping-cost')
        .find({ query: { address_id: address.id } })
        .then((it) => (it.shippingCost ? it.shippingCost : 0))
      : 0


    let discount = null
    let totalDiscount = null
    if (records.discount_id) {
      discount = await context.app.service('discounts').getModel()
        .query()
        .where({ id: records.discount_id, deletedAt: null })
        .then(it => it[0])
      if (!discount) throw new NotAcceptable('No se ha encontrado el descuento.')
      totalDiscount = await verifyDiscount(discount, user, shoppingCart.id, context)
    }


    records.total_price = 0;
    records.total_price_shipping_cost_excl = 0;
    records.total_price_tax_excl = 0;
    records.total_tax = 0;
    if (totalDiscount) {
      records.discount_id = discount.id
      records.meta_discount_name = discount.name
      records.meta_discount_code = discount.code
      if (discount.value_percentage) records.meta_discount_value_percentage = discount.value_percentage
      if (discount.value_amount) records.meta_discount_value_amount = discount.value_amount
      records.meta_discount_applies_to = discount.applies_to
      records.discount_total_amount = totalDiscount
    }

    let priceLists = null;

    const productsPrices = await getProductPrices(user)(
      shoppingCartDetails.map(it => it.product_id)
    )(context)

    for (const product of shoppingCartDetails) {
      const productTaxValue = product.tax_value ? product.tax_value : 0;
      const productPriceList = productsPrices.find(it => it.product_id === product.product_id)

      let productPrice = productPriceList.discount_price
        ? productPriceList.discount_price
        : productPriceList.price;

      const tax = (productTaxValue / 100) * productPrice;

      records.total_price +=
        productPrice * product.shopping_cart_details_quantity +
        tax * product.shopping_cart_details_quantity;
      records.total_price_shipping_cost_excl +=
        productPrice * product.shopping_cart_details_quantity +
        tax * product.shopping_cart_details_quantity;
      records.total_price_tax_excl +=
        productPrice * product.shopping_cart_details_quantity;
      records.total_tax += tax * product.shopping_cart_details_quantity;
    }

    if (totalDiscount) records.total_price = records.total_price - totalDiscount;

    records.order_status_id = 1;
    records.user_id = user.id;
    records.shopping_cart_meta_data = JSON.stringify({
      shopping_cart: shoppingCart,
      shopping_cart_details: shoppingCartDetails,
    });
    records.shopping_cart_id = shoppingCart.id;
    records.total_shipping_cost = shippingCost;

    context.dataOrders = {
      data: records,
      shoppingCart: shoppingCart,
      address: address,
      shoppingCartDetails,
      shippingCost: shippingCost,
      priceLists,
      totalsShoppingCartDetailsProducts: {
        total_price_tax_excl: records.total_price_tax_excl,
        total_tax: records.total_tax,
        total_price_tax_incl: records.total_price,
        total_price_shipping_cost_excl: records.total_price_shipping_cost_excl,
        total_price: shippingCost + records.total_price
      },
    };

    records.shipping_address_meta_data = JSON.stringify({
      ...JSON.parse(JSON.stringify(address || {})),
      seller: records.seller,
      fulfillment_company_id: records.fulfillment_company_id,
    });

    const { totalWeight, heigh, width, long, declared_value } =
      await calculateDataFulfillmentCompany({
        pack: shoppingCartDetails,
      })(context);

    const volume = await calculateVolume({ heigh, long, width })(context);

    let fulfillment_company_meta_data = {};
    if (records.fulfillment_company_id === 1) {
      //BUSCAMOS EN LA TRANSPORTADORA DE VIVA
      fulfillment_company_meta_data = await context.app
        .service('fulfillment-matrix')
        .getModel()
        .query()
        .select(
          'fulfillment_matrix.*',
          'locations_cities.name AS city_name',
          'fulfillment_company.name AS fulfillment_company_name '
        )
        .innerJoin(
          'locations_cities',
          'fulfillment_matrix.destination_city_id',
          '=',
          'locations_cities.id'
        )
        .innerJoin(
          'fulfillment_company',
          'fulfillment_matrix.fulfillment_company_id',
          '=',
          'fulfillment_company.id'
        )
        .where({
          fulfillment_company_id: records.fulfillment_company_id,
          dane_code: address.city.dane_code,
          'fulfillment_matrix.type': 'weight',
        })
        .where('min', '<=', totalWeight)
        .where('max', '>=', totalWeight)
        .then((it) => it[0]);
    } else if (records.fulfillment_company_id === 2) {
      //BUSCAMOS EN ENVIA
      if (!records.fulfillment_company_service_code)
        throw new NotAcceptable('Debes enviar el codigo del servicio.');
      fulfillment_company_meta_data = await context.app
        .service('envia-colvanes')
        .create({
          action: 'find',
          destination_city: `${address.city.dane_code}`,
          city_origin: '08001',
          weight: totalWeight,
          volume,
          number_of_units: 1,
          declared_value,
          service_code: records.fulfillment_company_service_code,
          sendDescription: [2, 13].includes(
            records.fulfillment_company_service_code
          )
            ? 'Aereo'
            : 'Terrestre',
        })
        .then((it) => ({ ...it, price: it.valor_flete + it.valor_costom }))
        .catch((it) => console.log(it, 'ERROR BUSCANDO VALOR EN ENVIA'));
    } else if (records.fulfillment_company_id === 5) {
      fulfillment_company_meta_data = {
        price: 0,
      };
    } else if (!records.fulfillment_company_id && requireShipping) {
      throw new NotAcceptable('Se requiere el mĂ©todo de envĂ­o')
    }


    fulfillment_company_meta_data.query = {
      totalWeight,
      heigh,
      width,
      long,
      declared_value,
    };

    records.fulfillment_company_meta_data = JSON.stringify(
      fulfillment_company_meta_data || {}
    );

    //SUMATORIA DEL PRECIO DEL ENVIO
    records.total_price += fulfillment_company_meta_data?.price || 0;
    records.total_price_tax_excl += fulfillment_company_meta_data?.price || 0;
    records.total_shipping_cost = fulfillment_company_meta_data?.price || 0;

    delete records.address_id;
    delete records.seller;
    delete records.fulfillment_company_service_code;

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
