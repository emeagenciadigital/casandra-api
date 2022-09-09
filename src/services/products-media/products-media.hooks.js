const removeSoftDelete = require("../../hooks/remove-softdelete");
const switchImagesProducts = require("./hooks/switch-images-products");
const removeProductsMedia = require("./hooks/remove-products-media");
const updateProducts = require("./hooks/update-product");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeProductsMedia()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [switchImagesProducts(), updateProducts()],
    update: [],
    patch: [updateProducts()],
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
