const { iff, isProvider } = require("feathers-hooks-common");
const restrict = require("../../hooks/restrict");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [iff(isProvider('external'), restrict())],
    create: [iff(isProvider('external'), restrict())],
    update: [iff(isProvider('external'), restrict())],
    patch: [iff(isProvider('external'), restrict())],
    remove: [iff(isProvider('external'), restrict())],
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
