// Initializes the `wompi-webhook-events` service on path `/wompi-webhook-events`
const { WompiWebhookEvents } = require('./wompi-webhook-events.class');
const hooks = require('./wompi-webhook-events.hooks');

module.exports = function (app) {
  const options = {
    paginate: {
      ...app.get('paginate'),
      max: Number.MAX_SAFE_INTEGER,
    }
  };

  // Initialize our service with any options it requires
  app.use('/wompi-webhook-events', new WompiWebhookEvents(options, app), function (req, res, next) {
    res.status(200)
    next()
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('wompi-webhook-events');

  service.hooks(hooks);
};
