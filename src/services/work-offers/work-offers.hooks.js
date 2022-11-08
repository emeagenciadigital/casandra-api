const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");
const { withJoins } = require("./work-offers.joins");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [withJoins()],
    get: [withJoins()],
    create: [syncMeilisearchHook()],
    update: [],
    patch: [syncMeilisearchHook()],
    remove: [syncMeilisearchHook()],
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
