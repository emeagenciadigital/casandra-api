const calculateRatingProducts = require("./hooks/calculate-rating-products");
const ratingScore = require("./hooks/register-ranting");
const { fastJoin } = require("feathers-hooks-common");

const join = {
  joins: {
    join: () => async (records, context) => {
      [records.user] = await Promise.all([
        context.app
          .service("users")
          .getModel()
          .query()
          .select("first_name", "last_name", "id")
          .where({
            id: records.user_id,
            deletedAt: null,
          })
          .then((it) => it),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ratingScore()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [fastJoin(join)],
    find: [],
    get: [],
    create: [calculateRatingProducts()],
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
