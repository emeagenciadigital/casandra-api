// Initializes the `wompi-pse-banks` service on path `/wompi-pse-banks`
const { WompiPseBanks } = require('./wompi-pse-banks.class');
const hooks = require('./wompi-pse-banks.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wompi-pse-banks', new WompiPseBanks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-pse-banks');

  service.hooks(hooks);
};
