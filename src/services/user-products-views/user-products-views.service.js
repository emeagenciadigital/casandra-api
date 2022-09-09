// Initializes the `user products views` service on path `/user-products-views`
const { UserProductsViews } = require('./user-products-views.class');
const createModel = require('../../models/user-products-views.model');
const hooks = require('./user-products-views.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-products-views', new UserProductsViews(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-products-views');

  service.hooks(hooks);
};
