// Initializes the `update-products` service on path `/update-products`
const { UpdateProducts } = require('./update-products.class');
const hooks = require('./update-products.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/update-products', new UpdateProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('update-products');

  service.hooks(hooks);
};
