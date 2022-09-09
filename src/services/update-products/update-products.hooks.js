const updateProduct = require("./hooks/update-products");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [updateProduct()],
    update: [],
    patch: [updateProduct()],
    remove: [],
  },

  after: {
    all: [],
    find: [],
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
