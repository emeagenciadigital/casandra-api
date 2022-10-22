const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");
const { joinWithAllData } = require('./contacts-directory.joins')

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
    create: [joinWithAllData(), syncMeilisearchHook()],
    update: [],
    patch: [joinWithAllData(), syncMeilisearchHook()],
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
