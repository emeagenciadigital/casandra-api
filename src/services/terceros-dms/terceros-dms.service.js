// Initializes the `terceros dms` service on path `/terceros-dms`
const { TercerosDms } = require('./terceros-dms.class');
const hooks = require('./terceros-dms.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/terceros-dms', new TercerosDms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('terceros-dms');

  service.hooks(hooks);
};
