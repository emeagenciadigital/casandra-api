const fulfillmentCompanies = require("./hooks/filtersfulfillmentsCompanies");

module.exports = {
  before: {
    all: [],
    find: [fulfillmentCompanies()],
    get: [],
    create: [],
    update: [],
    patch: [],
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
