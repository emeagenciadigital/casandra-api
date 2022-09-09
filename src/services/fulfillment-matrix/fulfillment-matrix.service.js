// Initializes the `fulfillment matrix` service on path `/fulfillment-matrix`
const { FulfillmentMatrix } = require('./fulfillment-matrix.class');
const createModel = require('../../models/fulfillment-matrix.model');
const hooks = require('./fulfillment-matrix.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fulfillment-matrix', new FulfillmentMatrix(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fulfillment-matrix');

  service.hooks(hooks);
};
