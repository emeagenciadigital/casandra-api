// Initializes the `labels_conditions` service on path `/labels-conditions`
const { LabelsConditions } = require('./labels_conditions.class');
const createModel = require('../../models/labels_conditions.model');
const hooks = require('./labels_conditions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/labels-conditions', new LabelsConditions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('labels-conditions');

  service.hooks(hooks);
};
