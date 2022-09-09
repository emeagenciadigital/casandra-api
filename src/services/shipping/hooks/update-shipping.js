// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;
    let shipping = null;

    if (!records.shipping_status_id)
      throw new NotAcceptable("Debes enviar el id del estado.");

    if (records.shipping_status_id == 2) {
      shipping = await context.app
        .service("shipping")
        .getModel()
        .query()
        .where({ id: context.id, deletedAt: null })
        .whereIn("shipping_status_id", [1, 4])
        .then((it) => it[0]);

      if (!shipping) throw new NotFound("No se encontró el envio.");

      const shippingDetails = await context.app
        .service("shipping-details")
        .getModel()
        .query()
        .select(
          "shipping_details.*",
          "products.weight AS weight",
          "products.heigh AS heigh",
          "products.width AS width",
          "products.long AS long",
          "products.price AS price",
          "products.id AS product_id",
          "products.name AS product_name",
          "shipping_details.quantity AS product_quantity",
          "products.code AS code"
        )
        .leftJoin(
          "orders_details",
          "shipping_details.order_detail_id",
          "=",
          "orders_details.id"
        )
        .leftJoin("products", "products.id", "=", "orders_details.product_id")
        .where({ shipping_id: shipping.id })
        .then((it) => it);

      if (shippingDetails < 1)
        throw new NotAcceptable(
          "Para enviar un envio, el envio debe contener productos dentro."
        );

      context.shippingDetails = shippingDetails;

      const order = await context.app
        .service("orders")
        .getModel()
        .query()
        .where({ id: shipping.order_id })
        .then((it) => it[0]);

      context.order = order;
      context.shipping = shipping;

      if (order.payment_method == "cash_on_delivery") {
        records.shipping_status_id = 5;
      }
    }

    replaceItems(context, records);

    return context;
  };
};
