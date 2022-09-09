const { authenticate } = require("@feathersjs/authentication").hooks;
const { hashPassword, protect } =
  require("@feathersjs/authentication-local").hooks;
const searchAdmin = require("./hooks/search-admin");
const activateUser = require("./hooks/activate-user");
const restrictPatch = require("./hooks/restrict-patch");


const {
  discard,
  iff,
  isProvider,
  disallow,
  fastJoin,
} = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const restrictUpdateRol = require("./hooks/restrict-update-rol");

const joinsResolves = {
  joins: {
    join: () => async (records, context) => {
      [records.credit_cards, records.addresses] = await Promise.all([
        context.app
          .service("credit-cards")
          .getModel()
          .query()
          .where({ user_id: records.id, deletedAt: null }),
        context.app
          .service("addresses")
          .getModel()
          .query()
          .where({ user_id: records.id, deletedAt: null }),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [iff(isProvider("external"), searchAdmin())],
    get: [iff(isProvider("external"), searchAdmin())],
    create: [hashPassword("password")],
    update: [disallow("external")],
    patch: [
      iff(
        isProvider("external"),
        discard(
          "credits",
          "facebookId",
          "token_reset_password",
          "password",
          "owner_company"
        )
      ),
      restrictUpdateRol(),
      hashPassword("password"),
      restrictPatch(),
      activateUser(),
    ],
    remove: [authenticate("jwt"), removeSoftDelete()],
  },

  after: {
    all: [protect("password"), fastJoin(joinsResolves)],
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
