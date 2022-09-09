// Initializes the `faq` service on path `/faq`
const { Faq } = require('./faq.class');
const createModel = require('../../models/faq.model');
const hooks = require('./faq.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/faq', new Faq(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('faq');

  service.hooks(hooks);
};
