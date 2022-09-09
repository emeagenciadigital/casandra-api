const searchShippingCost = require("./hooks/search-shipping-cost");
const searchShippingCostEnvia = require("./hooks/searh-shipping-cost-envia");

const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [searchShippingCostEnvia(), searchShippingCost()],
    get: [disallow("external")],
    create: [disallow("external")],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")],
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
