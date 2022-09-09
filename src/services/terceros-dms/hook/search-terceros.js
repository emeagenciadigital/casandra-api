// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = () => {
  return async (context) => {
    let records = getItems(context);

    console.log(context.params.query);

    const response = await context.app.service("puente-terceros").find({
      query: { ...context.params.query },
      paginate: false,
    }).catch(e => {
      console.error('servidor de dms caido');
      throw e
    });

    context.result = response;

    replaceItems(context, records);

    return context;
  };
};
