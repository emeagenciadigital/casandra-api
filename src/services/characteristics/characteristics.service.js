// Initializes the `characteristics` service on path `/characteristics`
const { Characteristics } = require('./characteristics.class');
const createModel = require('../../models/characteristics.model');
const hooks = require('./characteristics.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/characteristics', new Characteristics(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('characteristics');

  service.hooks(hooks);
};
