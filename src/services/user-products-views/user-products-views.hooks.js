const createProductView = require("./hooks/create-products-views");
const distingProductView = require("./hooks/distinct-products-view");
const asingToUser = require("./hooks/asing-to-user");
const { paramsFromClient, fastJoin } = require("feathers-hooks-common");

const joinResolves = {
  joins: {
    join: () => async (records, context) => {
      const { user } = context.params;
      records.product = await context.app
        .service("products")
        .get(records.product_id);
      const productPriceListService = context.app.service("product-price-list");

      const products_price_list = await productPriceListService
        .find({
          query: {
            product_id: records.product.id,
            deletedAt: null,
          },
          paginate: false,
        })
        .then((it) => it);

      const product_list = [];
      for (const key in products_price_list) {
        const product_price_list = products_price_list[key];
        product_list.push(product_price_list);
      }
      records.product_list = product_list;
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [
      paramsFromClient("distinct", "off_line_token"),
      distingProductView(),
    ],
    get: [paramsFromClient("distinct", "off_line_token"), distingProductView()],
    create: [createProductView()],
    update: [],
    patch: [asingToUser()],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(joinResolves)],
    get: [fastJoin(joinResolves)],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
