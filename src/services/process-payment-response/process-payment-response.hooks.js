const processPaymentOrders = require("./hooks/process-payment-orders");
const { disallow } = require("feathers-hooks-common");
const processPaymentCustom = require("./hooks/process-payment-custom");

module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [processPaymentOrders(), processPaymentCustom()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
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
