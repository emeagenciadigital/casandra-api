// Initializes the `discounts` service on path `/discounts`
const { Discounts } = require('./discounts.class');
const createModel = require('../../models/discounts.model');
const hooks = require('./discounts.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/discounts', new Discounts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('discounts');

  service.hooks(hooks);
};
