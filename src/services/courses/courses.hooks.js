const { iff } = require("feathers-hooks-common");
const { courseDetailJoin } = require("./courses.joins");
const assignSlugHook = require("./hooks/assign-slug.hook");
const lastUpdatedHook = require("./hooks/lastUpdated.hook");
const syncMeilisearchHook = require("./hooks/sync-meilisearch.hook");

const validateJoins = () => (context) => {
  const query = context.params.query
  return !!query?.slug
}

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
    find: [iff(validateJoins(), courseDetailJoin())],
    get: [courseDetailJoin()],
    create: [assignSlugHook()],
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
