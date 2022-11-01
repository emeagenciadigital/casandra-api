const restrict = require("../../hooks/restrict");
const createVerificationHook = require("./hooks/create-verification.hook");
const verifyCreditCardHook = require("./hooks/verify-credit-card.hook");

module.exports = {
  before: {
    all: [],
    find: [restrict()],
    get: [restrict()],
    create: [createVerificationHook()],
    update: [restrict()],
    patch: [verifyCreditCardHook()],
    remove: [restrict()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
