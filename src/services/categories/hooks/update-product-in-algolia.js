// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  // checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
//const updateExpressProductsAlgolia = require("../../../hooks/update-express-products-algolia");
// const batchUpdateExpressProductsAlgolia = require("../../../hooks/batch-update-express-products-algolia");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const products = await context.app
      .service("products")
      .find({
        query: {
          $eager: "[brand,category, category_2, category_3]",
          deletedAt: null,
          status: "active",
        },
      })
      .then((it) => it.data);

    context.app.service('meilisearch').patch(null, products)

    replaceItems(context, records);

    return context;
  };
};


