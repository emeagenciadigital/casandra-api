// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const shoppingCartHooks = require("../shopping-cart.hooks");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (context.params.query.token) {
      context.params.query["token"] = context.params.query.token;
    } else if (user) {
      const shoppingCards = await context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where({
          user_id: user.id,
          status: "active",
          deletedAt: null,
        })
        .then((it) => it);

      if (shoppingCards.length) {
        context.params.query["id"] = {
          $in: shoppingCards.map((shoppingCard) => shoppingCard.id),
        };
      } else if (!shoppingCards.length && !context.params.query.token) {
        context.result = { data: [] };
      } else if (!shoppingCards.length && context.params.query.token) {
        context.params.query["token"] = context.params.query.token;
      }
    } else if (!context.params.query.token) {
      context.result = { data: [] };
    }

    replaceItems(context, records);

    return context;
  };
};
