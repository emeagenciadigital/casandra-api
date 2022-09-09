// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const registerOrderHistory = require("../../../hooks/register-order-history");

module.exports = function (options = {}) {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    const order = await context.app
      .service("orders")
      .getModel()
      .query()
      .findOne({ id: context.id, company_id: user.company_id });

    if (
      records.order_status_id == 12 ||
      (records.order_status_id == 3 && user.owner_company == "true")
    ) {
      if (records.order_status_id == 3) {
        if (!order) throw new NotFound("Order no encontrada.");

        const data = {
          type: "orders",
          order_id: order.id,
          response_code: 1,
          payment_info: "pago aprobado a credito",
        };

        await context.app.service("process-payment-response").create(data);
      } else if (records.order_status_id == 12) {
        await registerOrderHistory({
          order_id: order.id,
          order_status_id: records.order_status_id,
          company_id: user.company_id,
        })(context);
      }
    }

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
