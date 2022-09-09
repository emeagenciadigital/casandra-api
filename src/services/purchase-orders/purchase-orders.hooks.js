const sendEmail = require("./hooks/send-email");
const register = require("./hooks/register");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [register()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendEmail()],
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
