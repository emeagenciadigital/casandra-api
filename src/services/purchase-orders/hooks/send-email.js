// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const dataNotificationAdmin = {
      type: "email",
      order: records.id,
      typeNotification: "purchaseOrderCreated",
    };

    await Promise.all([
      context.app.service("send-notifications").create(dataNotificationAdmin),
    ]);

    replaceItems(context, records);

    return context;
  };
};
