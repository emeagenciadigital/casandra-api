const { fastJoin } = require('feathers-hooks-common');

const joinResolves = {
  joins: {
    join: () => async (records, context) => {
      const { app } = context;
      [records.product, records.products_characteristics] = await Promise.all([
        app
          .service('products')
          .getModel()
          .query()
          .where({ id: records.product_id })
          .then((it) => it[0]),
        app
          .service('products-characteristics')
          .getModel()
          .query()
          .where({ product_id: records.product_id, deletedAt: null })
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
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [fastJoin(joinResolves)],
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
