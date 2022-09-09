// Initializes the `catalogs` service on path `/catalogs`
const { Catalogs } = require('./catalogs.class');
const createModel = require('../../models/catalogs.model');
const hooks = require('./catalogs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/catalogs', new Catalogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('catalogs');

  service.hooks(hooks);
};
