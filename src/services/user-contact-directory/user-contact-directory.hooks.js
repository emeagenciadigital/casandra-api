const createUserContactDirectoryHook = require('./hooks/create-user-contact-directory.hook');
const { joinWithAllData } = require('./user-contact-directory.joins');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createUserContactDirectoryHook()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [joinWithAllData()],
    find: [],
    get: [],
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
