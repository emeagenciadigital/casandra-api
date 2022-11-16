// Initializes the `users-addresses` service on path `/addresses`
const { PriceListPrices } = require("./price-list-prices.class");
const createModel = require("../../models/price-list-prices.model");
const hooks = require("./price-list-prices.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/price-list-prices", new PriceListPrices(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("price-list-prices");

  service.hooks(hooks);
};
