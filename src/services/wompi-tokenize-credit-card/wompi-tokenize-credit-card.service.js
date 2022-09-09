// Initializes the `wompi-tokenize-credit-card` service on path `/wompi-tokenize-credit-card`
const { WompiTokenizeCreditCard } = require('./wompi-tokenize-credit-card.class');
const hooks = require('./wompi-tokenize-credit-card.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wompi-tokenize-credit-card', new WompiTokenizeCreditCard(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-tokenize-credit-card');

  service.hooks(hooks);
};
