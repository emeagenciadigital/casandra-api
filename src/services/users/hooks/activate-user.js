const { getItems, replaceItems } = require('feathers-hooks-common');

module.exports = (options = {}) => {
  return async (context) => {
    let { user } = context.params;

    let records = getItems(context);

    if (
      (user.status === 'pending user data' &&
        user.first_name &&
        user.last_name &&
        user.dni &&
        user.email) || (
        user.status === 'pending user data' &&
        records.first_name &&
        records.last_name &&
        records.dni &&
        records.email
      )
    ) {
      records.status = 'active';
    }
    replaceItems(context, records);
    return context;
  };
};
