const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");
const { joinWithAllData } = require('./contacts-directory.joins');
const assignSlugHook = require("../../hooks/assign-slug.hook");
const { discard } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [assignSlugHook({ keyName: 'name' })],
    update: [discard('slug')],
    patch: [discard('slug')],
    remove: [],
  },

  after: {
    all: [],
    find: [joinWithAllData()],
    get: [joinWithAllData()],
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
