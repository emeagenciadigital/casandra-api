// Initializes the `orders details` service on path `/orders-details`
const { OrdersDetails } = require('./orders-details.class');
const createModel = require('../../models/orders-details.model');
const hooks = require('./orders-details.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/orders-details', new OrdersDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('orders-details');

  service.hooks(hooks);
};
