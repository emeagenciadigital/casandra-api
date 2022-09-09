const searchDOcumentosPed = require("./hooks/search-documentos-ped");
const { disallow } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [searchDOcumentosPed()],
    get: [searchDOcumentosPed()],
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
