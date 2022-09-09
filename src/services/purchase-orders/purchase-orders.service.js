// Initializes the `purchase orders` service on path `/purchase-orders`
const { PurchaseOrders } = require('./purchase-orders.class');
const createModel = require('../../models/purchase-orders.model');
const hooks = require('./purchase-orders.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/purchase-orders', new PurchaseOrders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('purchase-orders');

  service.hooks(hooks);
};
