// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
var axios = require("axios");
const { NotAcceptable, Forbidden } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);
    const { user } = context.params;

    if (user) {
      context.params.query ? delete context.params.query.id : null;
      context.params.query.nit = user.company.nit;
      const response = await context.app
        .service("puente-documentos-ped-historia")
        .find({
          query: {
            ...context.params.query,
            authorization: context.params.headers.authorization,
          },
        });

      context.result = response;
    } else throw new Forbidden("No tienes un token.");

    //QUEDASTE HACIENDO EL REQUESTS PARA EL ENDPOINT DE ABAJO

    replaceItems(context, records);

    return context;
  };
};
