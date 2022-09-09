// Initializes the `wompi-webhook-events` service on path `/wompi-webhook-events`
const { WompiWebhookEvents } = require('./wompi-webhook-events.class');
const hooks = require('./wompi-webhook-events.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/wompi-webhook-events', new WompiWebhookEvents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-webhook-events');

  service.hooks(hooks);
};
