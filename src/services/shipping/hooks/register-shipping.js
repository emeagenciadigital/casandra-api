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

    const orderModel = context.app.service("orders").getModel().query();

    const order = await orderModel
      .whereIn("order_status_id", [1, 2, 3, 5, 6, 7])
      .where({ id: records.order_id, deletedAt: null })
      .then((it) => it[0]);

    if (!order) throw new NotFound("No se encontró la orden.");
    if (
      order.order_status_id == 1 &&
      order.payment_method != "cash_on_delivery"
    )
      throw new NotAcceptable(
        "No se puede enviar la orden por que no esta para pagar en efectivo."
      );

    // await orderModel
    //   .patch({ order_status_id: 3 })
    //   .where({ id: records.order_id, deletedAt: null })
    //   .then((it) => it[0]);

    // registerOrderHistory({
    //   order_id: records.order_id,
    //   order_status_id: 3,
    // })(context);

    records.delivery_guy_user_id = user.id;
    records.shipping_status_id =
      order.payment_method == "cash_on_delivery" ? 4 : 1;

    records.pending_payment = 0;
    records.payment_received = 0;

    replaceItems(context, records);

    return context;
  };
};
