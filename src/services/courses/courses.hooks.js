const { courseDetailJoin } = require("./courses.joins");
const lastUpdatedHook = require("./hooks/lastUpdated.hook");
const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [lastUpdatedHook()],
    update: [],
    patch: [lastUpdatedHook()],
    remove: [],
  },

  after: {
    all: [syncMeilisearchHook()],
    find: [],
    get: [courseDetailJoin()],
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
