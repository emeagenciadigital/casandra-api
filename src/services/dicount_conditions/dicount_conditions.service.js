// Initializes the `dicount_conditions` service on path `/dicount-conditions`
const { DicountConditions } = require('./dicount_conditions.class');
const createModel = require('../../models/dicount_conditions.model');
const hooks = require('./dicount_conditions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/dicount-conditions', new DicountConditions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('dicount-conditions');

  service.hooks(hooks);
};
