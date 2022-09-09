// Initializes the `design` service on path `/design`
const { Design } = require('./design.class');
const createModel = require('../../models/design.model');
const hooks = require('./design.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/design', new Design(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('design');

  service.hooks(hooks);
};
