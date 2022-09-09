const { disallow } = require("feathers-hooks-common");
const getWompiBanksHook = require("./hooks/get-wompi-banks.hook");


module.exports = {
  before: {
    all: [],
    find: [],
    get: [disallow()],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [getWompiBanksHook()],
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
