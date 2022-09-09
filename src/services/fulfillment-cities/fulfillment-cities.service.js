// Initializes the `fulfillment cities` service on path `/fulfillment-cities`
const { FulfillmentCities } = require('./fulfillment-cities.class');
const createModel = require('../../models/fulfillment-cities.model');
const hooks = require('./fulfillment-cities.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 50,
      max: 500000,
    },
  };

  // Initialize our service with any options it requires
  app.use('/fulfillment-cities', new FulfillmentCities(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fulfillment-cities');

  service.hooks(hooks);
};
