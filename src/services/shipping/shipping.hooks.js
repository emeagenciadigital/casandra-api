const RegisterShippping = require("./hooks/register-shipping");
const UpdateShiping = require("./hooks/update-shipping");
const UpdateShipingAfterUpdate = require("./hooks/update-shipping-after-update");
const UpdateDelivered = require("./hooks/update-delivered");
const UpdateDeliveredAfterPatch = require("./hooks/update-delivered-after-patch");
const registerShippingHistory = require("./hooks/register-shipping-history");
const { disallow, fastJoin } = require("feathers-hooks-common");
const calculateShipping = require("./hooks/calculateShipping");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      let service = null;
      [
        records.fulfillment_company,
        records.shipping_status,
        records.delivery_guy_user,
        records.order,
        records.shipping_details,
        records.shipping_history,
      ] = await Promise.all([
        context.app
          .service("fulfillment-company")
          .getModel()
          .query()
          .select("id", "name", "description")
          .where({ id: records.fulfillment_company_id })
          .then((it) => it[0]),
        context.app
          .service("shipping-status")
          .getModel()
          .query()
          .where({ id: records.shipping_status_id })
          .then((it) => it[0]),
        context.app
          .service("users")
          .getModel()
          .query()
          .select("first_name", "last_name", "dni", "email", "phone")
          .where({ id: records.delivery_guy_user_id })
          .then((it) => it[0]),
        context.app
          .service("orders")
          .getModel()
          .query()
          .where({ id: records.order_id })
          .then((it) => it[0]),
        context.app
          .service("shipping-details")
          .find({ query: { shipping_id: records.id }, paginate: false })
          .then((it) => it),
        context.app
          .service("shipping-history")
          .find({ query: { shipping_id: records.id }, paginate: false })
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
    create: [RegisterShippping()],
    update: [disallow("external")],
    patch: [UpdateShiping(), calculateShipping()],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [registerShippingHistory()],
    update: [],
    patch: [
      UpdateShipingAfterUpdate(),
      registerShippingHistory(),
      UpdateDelivered(),
    ],
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
