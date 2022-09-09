// Initializes the `wompi-generate-merchant` service on path `/wompi-generate-merchant`
const { WompiGenerateMerchant } = require('./wompi-generate-merchant.class');
const hooks = require('./wompi-generate-merchant.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wompi-generate-merchant', new WompiGenerateMerchant(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-generate-merchant');

  service.hooks(hooks);
};
