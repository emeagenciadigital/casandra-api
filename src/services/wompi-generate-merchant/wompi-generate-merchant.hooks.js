const { disallow } = require("feathers-hooks-common");
const createMerchantHook = require("./hooks/create-merchant.hook");


module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [createMerchantHook()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
