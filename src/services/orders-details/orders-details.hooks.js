const { fastJoin } = require("feathers-hooks-common");

const Join = {
  joins: {
    join: () => async (records, context) => {
      [records.shippings_details, records.product_integration_id] = await Promise.all([
        context.app
          .service("shipping-details")
          .getModel()
          .query()
          .where({
            order_detail_id: records.id,
            deletedAt: null,
          })
          .then((it) => it),
        context.app
          .service('products')
          .getModel()
          .query()
          .select('integration_id')
          .where({ id: records.product_id })
          .then(it => it[0].integration_id)
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(Join)],
    get: [fastJoin(Join)],
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
