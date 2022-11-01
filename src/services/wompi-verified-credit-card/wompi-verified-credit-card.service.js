// Initializes the `wompi-tokenize-credit-card` service on path `/wompi-tokenize-credit-card`
const { WompiVerifiedCreditCard } = require('./wompi-verified-credit-card.class');
const hooks = require('./wompi-verified-credit-card.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    multi: ['patch']
  };

  // Initialize our service with any options it requires
  app.use('/wompi-verified-credit-card', new WompiVerifiedCreditCard(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-verified-credit-card');

  service.hooks(hooks);
};
