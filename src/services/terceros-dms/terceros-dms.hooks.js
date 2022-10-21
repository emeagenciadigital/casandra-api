const searchTerceros = require("./hook/search-terceros");
const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [disallow("external"), searchTerceros()],
    get: [disallow("external"), searchTerceros()],
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