const addressesBC = require("./hooks/addresses-b-c");
const addressesAC = require("./hooks/addreeses-a-c");
const addressesAP = require("./hooks/addresses-a-p");
const searchAdmin = require("./hooks/search-admin");
const addreesesBeforePatch = require("./hooks/addreeses-before-patch.js");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.user, records.state, records.city] = await Promise.all([
        context.app
          .service("users")
          .getModel()
          .query()
          .select('email', 'first_name', 'last_name', 'phone', 'gender', 'profile_picture', 'phone')
          .where({ id: records.user_id, deletedAt: null })
          .then((it) => it[0]),
        context.app
          .service("locations-states")
          .getModel()
          .findByPk(records.state_id),
        context.app
          .service("locations-cities")
          .getModel()
          .findByPk(records.city_id)
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [addressesBC()],
    update: [],
    patch: [addreesesBeforePatch()],
    remove: [],
  },

  after: {
    all: [fastJoin(resolves)],
    find: [],
    get: [],
    create: [addressesAC()],
    update: [],
    patch: [addressesAP()],
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
