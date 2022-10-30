const { RawQueries } = require('./raw-queries.class');
const userPurchaseProductsHooks = require('./hooks/user-purchase-products.hook');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/raw-queries/user-purchase-products', new RawQueries(options, app));

  // Get our initialized service so that we can register hooks
  const userPurchaseProductsService = app.service('raw-queries/user-purchase-products');

  userPurchaseProductsService.hooks(userPurchaseProductsHooks);
};
