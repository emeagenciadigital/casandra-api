const calculateProgressHook = require("./hooks/calculate-progress.hook");
const createUserChapterView = require("./hooks/create-user-chapter-view");


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createUserChapterView()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [calculateProgressHook()],
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
