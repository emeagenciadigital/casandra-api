// Initializes the `banners` service on path `/banners`
const { Banners } = require('./banners.class');
const createModel = require('../../models/banners.model');
const hooks = require('./banners.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/banners', new Banners(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('banners');

  service.hooks(hooks);
};
