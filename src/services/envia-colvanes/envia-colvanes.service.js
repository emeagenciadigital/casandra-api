// Initializes the `envia-colvanes` service on path `/envia-colvanes`
const { EnviaColvanes } = require('./envia-colvanes.class');
const hooks = require('./envia-colvanes.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/envia-colvanes', new EnviaColvanes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('envia-colvanes');

  service.hooks(hooks);
};
