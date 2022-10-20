// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  // checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// const batchUpdateExpressProductsAlgolia = require("../../../hooks/batch-update-express-products-algolia");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const products = await context.app
      .service("products")
      .getModel()
      .query()
      .where({ category_id: context.id, deletedAt: null, status: "active" });

    if (products.length > 0) {
      throw new NotAcceptable(
        "No se puede eliminar la categoria por que un - unos productos la estan usando."
      );
    }

    replaceItems(context, records);

    return context;
  };
};
