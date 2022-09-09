// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!context.id) throw new NotAcceptable("Debes enviar el id.");

    const shippingModel = context.app.service("shipping").getModel().query();
    const orderDetailModel = context.app
      .service("orders-details")
      .getModel()
      .query();

    const knex = context.app.get("knex");

    if (records.shipping_status_id == 3) {
      const [orderDetails, orderDetailsSent] = await Promise.all([
        orderDetailModel
          .where({ order_id: records.order_id, deletedAt: null })
          .then((it) => it),
        knex
          .raw(
            `SELECT
              orders_details.id
            FROM orders_details
              INNER JOIN shipping_details ON shipping_details.order_detail_id = orders_details.id
              INNER JOIN shipping ON shipping.id = shipping_details.shipping_id
            WHERE
              orders_details.quantity = orders_details.sent 
              AND orders_details.order_id = ${records.order_id}
              AND shipping.shipping_status_id = 3
            GROUP BY orders_details.id`
          )
          .then((it) => it[0]),
      ]);

      //se actualiza la orden a entregada o entregada parcialmente
      let order_status_id = null;
      if (orderDetails.length == orderDetailsSent.length) {
        order_status_id = 9;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      } else {
        order_status_id = 6;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      }

      registerOrderHistory({
        order_id: records.order_id,
        order_status_id: order_status_id,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
