const { iff, isProvider } = require("feathers-hooks-common");
const restrict = require("../../hooks/restrict");

module.exports = {
  before: {
    all: [iff(isProvider('external'), restrict())],
    find: [],
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
