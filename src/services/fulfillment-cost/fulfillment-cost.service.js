// Initializes the `fulfillment-cost` service on path `/fulfillment-cost`
const { FulfillmentCost } = require('./fulfillment-cost.class');
const hooks = require('./fulfillment-cost.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fulfillment-cost', new FulfillmentCost(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fulfillment-cost');

  service.hooks(hooks);
};
