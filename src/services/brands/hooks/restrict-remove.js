// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems
} = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let records = getItems(context);

    const products = await context.app
      .service("products")
      .getModel()
      .query()
      .where({ brand_id: context.id, deletedAt: null });

    if (products.length > 0) {
      throw new NotAcceptable(
        "No se puede eliminar la marca por que un - unos productos la están usando."
      );
    }

    replaceItems(context, records);

    return context;
  };
};
