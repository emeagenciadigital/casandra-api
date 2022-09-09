const updateProductInAlgolia = require("./hooks/update-product-in-algolia");
const restrictRemove = require("./hooks/restrict-remove");
const removeSoftdelete = require("../../hooks/remove-softdelete");
const categoriesAfterFind = require("./hooks/categories-after-find");
const asingSlug = require("./hooks/asing-slug");
const { paramsFromClient } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [paramsFromClient("tree")],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [restrictRemove(), removeSoftdelete()],
  },

  after: {
    all: [],
    find: [categoriesAfterFind()],
    get: [],
    create: [asingSlug()],
    update: [],
    patch: [asingSlug(), updateProductInAlgolia()],
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
