const { courseDetailJoin, courseProductJoin, joinWithUserCourses } = require("./courses.joins");
const assignSlugHook = require("./hooks/assign-slug.hook");
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
    find: [
      courseDetailJoin(),
      courseProductJoin()
    ],
    get: [joinWithUserCourses(), courseDetailJoin(), courseProductJoin()],
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
