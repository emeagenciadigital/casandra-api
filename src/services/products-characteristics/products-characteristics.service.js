// Initializes the `products characteristics` service on path `/products-characteristics`
const { ProductsCharacteristics } = require('./products-characteristics.class');
const createModel = require('../../models/products-characteristics.model');
const hooks = require('./products-characteristics.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/products-characteristics', new ProductsCharacteristics(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('products-characteristics');

  service.hooks(hooks);
};
