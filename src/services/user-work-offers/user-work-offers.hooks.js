const applyToWorkOfferHook = require("./hooks/apply-to-work-offer.hook");
const { withWorkOfferJoin } = require("./user-work-offers.joins");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [applyToWorkOfferHook()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [withWorkOfferJoin()],
    get: [withWorkOfferJoin()],
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
