const RegisterShippingDetail = require("./hooks/register-shipping-detail");
const RestricUpdateQuantity = require("./hooks/restrict-update-quantity-shipped");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.order_detail] = await Promise.all([
        context.app
          .service("orders-details")
          .find({ query: { id: records.order_detail_id }, paginate: false })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [RegisterShippingDetail()],
    update: [],
    patch: [RestricUpdateQuantity()],
    remove: [],
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
