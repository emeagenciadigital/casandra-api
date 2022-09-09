// Initializes the `create-process-payment` service on path `/create-process-payment`
const { CreateProcessPayment } = require('./create-process-payment.class');
const hooks = require('./create-process-payment.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/create-process-payment', new CreateProcessPayment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('create-process-payment');

  service.hooks(hooks);
};
