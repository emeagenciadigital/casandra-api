// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    await registerOrderHistory({
      order_id: records.id,
      order_status_id: records.order_status_id,
      user_id: records.user_id,
    })(context);

    replaceItems(context, records);

    return context;
  };
};
