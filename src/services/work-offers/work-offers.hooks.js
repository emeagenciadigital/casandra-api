const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");
const { withCategoryJoin } = require("./work-offers.joins");

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
    find: [],
    get: [withCategoryJoin()],
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
