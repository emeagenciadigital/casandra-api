const createOrUpdateFulFillmentMatrix = require("./hooks/createOrUpdateFulfillmentMatrix");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [
        records.fulfillment_company,
        records.destination_city,
      ] = await Promise.all([
        context.app
          .service("fulfillment-company")
          .getModel()
          .query()
          .where({ id: records.fulfillment_company_id })
          .then((it) => it[0]),
        context.app
          .service("locations-cities")
          .getModel()
          .findByPk(records.destination_city_id)
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createOrUpdateFulFillmentMatrix()],
    update: [],
    patch: [createOrUpdateFulFillmentMatrix()],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
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
