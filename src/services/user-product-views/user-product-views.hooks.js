const { paramsFromClient } = require("feathers-hooks-common");
const createProductViewHook = require("./hooks/create-product-view.hook");
const getUserViewProductsHook = require("./hooks/get-user-view-products.hook");
const { withProductJoin } = require("./user-product-views.joins");

module.exports = {
  before: {
    all: [],
    find: [
      paramsFromClient('userViewProduct'),
      getUserViewProductsHook()
    ],
    get: [],
    create: [createProductViewHook()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [withProductJoin()],
    get: [],
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
