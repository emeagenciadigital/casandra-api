// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const calculateDataFulfillmentCompany = require("../../../hooks/calculateDataFulfillmentCompany");
const calculateVolume = require("../../../hooks/calculate-volume");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!context.params.query.shipping_id) return context;
    const shipping = await context.app
      .service("shipping")
      .getModel()
      .query()
      .where({ id: context.params.query.shipping_id, deletedAt: null })
      .then((it) => it[0]);

    if (!shipping) throw new NotAcceptable("Envio no encontrado");

    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .select("shipping_address_meta_data")
      .where({ id: shipping.order_id })
      .then((it) => it[0]);

    const { dane_code, city_name } = JSON.parse(
      order.shipping_address_meta_data
    );

    const pack = await context.app
      .service("shipping-details")
      .getModel()
      .query()
      .select(
        "shipping_details.*",
        "shipping_details.id AS shipping_detail_id",
        "shipping_details.quantity AS product_quantity",
        "products.*",
        "products.id AS product_id"
      )
      .innerJoin(
        "orders_details",
        "orders_details.id",
        "=",
        "shipping_details.order_detail_id"
      )
      .innerJoin("products", "products.id", "=", "orders_details.product_id")
      .where({
        shipping_id: shipping.id,
        "shipping_details.deletedAt": null,
      })
      .then((it) => it);

    if (pack.lengh < 1)
      throw new NotAcceptable("El envio debe tener productos asignados.");

    let {
      totalWeight,
      heigh,
      width,
      long,
      declared_value,
    } = await calculateDataFulfillmentCompany({
      pack,
    })(context);

    const volume = await calculateVolume({ heigh, long, width })(context);

    let servicesCodes = [];

    if (totalWeight > 9) {
      servicesCodes.push(2, 3);
    }
    if (totalWeight < 9) {
      servicesCodes.push(12, 13);
    }

    const quote = [];
    let response = [];
    let sendDescription = null;
    for (const key in servicesCodes) {
      const code = servicesCodes[key];
      if (code == 3 || code == 12) {
        sendDescription = "Terrestre";
      } else sendDescription = "Aereo";
      quote.push(
        await context.app.service("envia-colvanes").create({
          action: "find",
          destination_city: `${dane_code}`,
          city_origin: "08001",
          weight: totalWeight,
          volume,
          number_of_units: 1,
          declared_value,
          service_code: code,
          sendDescription: sendDescription,
        })
      );
    }

    if (quote.status == "success") {
      quote.city_name = city_name;
      quote.destination_city_dane = dane_code;
      quote.price = quote.valor_costom + quote.valor_flete;
      //   quote.fulfillmentCompany = company;
    }

    response.push(
      ...quote.map((it) => ({
        ...it,
        city_name: city_name,
        destination_city_dane: dane_code,
        price: it.valor_costom + it.valor_flete,
        // fulfillmentCompany: company,
      }))
    );

    context.result = response;

    context.colvanes = "true";
    replaceItems(context, records);

    return context;
  };
};
