const { discard } = require("feathers-hooks-common");
const assignSlugHook = require("../../hooks/assign-slug.hook");
const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");
const { withJoins } = require("./work-offers.joins");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [assignSlugHook({ keyName: 'job' })],
    update: [discard('slug')],
    patch: [discard('slug')],
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
