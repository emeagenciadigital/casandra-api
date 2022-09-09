const findQuote = require("./hooks/findQuote");
const generateGuide = require("./hooks/generateGuide");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [findQuote(), generateGuide()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
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
