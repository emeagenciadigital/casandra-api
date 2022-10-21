const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");


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
    get: [],
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
