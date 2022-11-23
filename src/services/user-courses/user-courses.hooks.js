const { iff, isProvider, disallow } = require("feathers-hooks-common");
const { withCoursesAndChaptersViews } = require("./user-courses.joins");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [iff(isProvider('external'), disallow())],
    update: [iff(isProvider('external'), disallow())],
    patch: [iff(isProvider('external'), disallow())],
    remove: [iff(isProvider('external'), disallow())],
  },

  after: {
    all: [],
    find: [withCoursesAndChaptersViews()],
    get: [withCoursesAndChaptersViews()],
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
