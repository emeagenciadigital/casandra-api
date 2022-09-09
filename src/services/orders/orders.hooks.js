const registerOrders = require('./hooks/registers-orders');
const changeStatusShoppingCart = require('./hooks/change-status-shopping-cart');
const registerOrdersDetails = require('./hooks/register-orders-details');
const registerOrderHistory = require('./hooks/register-order-history');
const searchAdmin = require('./hooks/search-admin');
// const discountStock = require('./hooks/discount-stock');
const processPaymentCredit = require('./hooks/process-payment-credit');
const approvalOrderOwnerCompany = require('./hooks/approval-order-owner-company');
const { fastJoin } = require('feathers-hooks-common');

const ordersJoin = {
  joins: {
    join: () => async (records, context) => {
      const orderStatusModel = context.app.service('orders-status').getModel();
      const companiesService = context.app.service('companies');
      const usersModel = context.app.service('users').getModel();
      [records.order_details, records.shippings, records.history] =
        await Promise.all([
          context.app
            .service('orders-details')
            .find({
              query: { order_id: records.id, deletedAt: null },
              paginate: false,
            })
            .then((it) => it),
          context.app
            .service('shipping')
            .find({
              query: {
                order_id: records.id,
                deletedAt: null,
              },
              paginate: false,
            })
            .then((it) => it),
          context.app
            .service('order-history')
            .getModel()
            .query()
            .select(
              'order_history.id AS id',
              'order_history.createdAt AS createdAt',
              'order_history.order_id',
              'orders_status.name',
              'orders_status.id AS orders_status_id'
            )
            .innerJoin(
              'orders_status',
              'orders_status.id',
              '=',
              'order_history.order_status_id'
            )
            .where({
              'order_history.order_id': records.id,
              'order_history.deletedAt': null,
            })
            .then((it) => it),
        ]);

      records.fulfillment_company = await context.app
        .service('fulfillment-company')
        .getModel()
        .query()
        .where({ id: records.fulfillment_company_id })
        .then((it) => it[0]);

      records.total_payment_received = await context.app
        .service('payment-confirmations')
        .getModel()
        .query()
        .sum('value as total')
        .whereIn('status', ['success', 'approved'])
        .where({
          deletedAt: null,
          order_id: records.id,
        })
        .then((it) => (it[0].total ? it[0].total : 0));

      records.total_payment_pending =
        records.total_price - records.total_payment_received;

      records.status = await orderStatusModel
        .query()
        .where({
          id: records.order_status_id,
          deletedAt: null,
        })
        .then((it) => it[0]);

      records.user = await usersModel
        .query()
        .select(
          'email',
          'first_name',
          'last_name',
          'dni',
          'phone_country_code',
          'phone'
        )
        .where({
          id: records.user_id,
        })
        .then((it) => it[0]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerOrders()],
    update: [],
    patch: [approvalOrderOwnerCompany()],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(ordersJoin)],
    get: [fastJoin(ordersJoin)],
    create: [
      registerOrderHistory(),
      changeStatusShoppingCart(),
      registerOrdersDetails(),
      processPaymentCredit(),
      // discountStock(),
      // calculateShipping(), //correrlo de ultimo
    ],
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
