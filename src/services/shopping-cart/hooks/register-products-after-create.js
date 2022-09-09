// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);
    if (context.shopping_cart_details && context.shopping_cart_details.status) {
      const data = {
        product_id: context.shopping_cart_details.product_id,
        quantity: context.shopping_cart_details.quantity,
        shopping_cart_id: records.id,
      };

      await context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .insert(data);
    }

    replaceItems(context, records);

    return context;
  };
};
