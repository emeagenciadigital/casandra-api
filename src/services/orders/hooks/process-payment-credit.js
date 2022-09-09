// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (records.payment_method == "credit") {
      const data = {
        type: "orders",
        order_id: records.id,
        response_code: user.company.order_needs_approval == "true" ? 4 : 1,
        payment_info: "pago aprobado a credito",
      };

      await context.app.service("process-payment-response").create(data);
    }

    replaceItems(context, records);

    return context;
  };
};
