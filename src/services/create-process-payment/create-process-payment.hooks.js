const { disallow } = require("feathers-hooks-common");
const createPaymentHook = require("./hooks/create-payment.hook");
const validateAndFindDataHook = require("./hooks/validate-and-find-data.hook");

module.exports = {
  before: {
    all: [  ],
    find: [disallow()],
    get: [disallow()],
    create: [validateAndFindDataHook()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createPaymentHook()],
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
