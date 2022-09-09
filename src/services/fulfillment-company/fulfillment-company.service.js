// Initializes the `fulfillment company` service on path `/fulfillment-company`
const { FulfillmentCompany } = require('./fulfillment-company.class');
const createModel = require('../../models/fulfillment-company.model');
const hooks = require('./fulfillment-company.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use('/fulfillment-company', new FulfillmentCompany(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fulfillment-company');

  service.hooks(hooks);
};
