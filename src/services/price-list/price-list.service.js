// Initializes the `users-addresses` service on path `/addresses`
const { PriceList } = require("./price-list.class");
const createModel = require("../../models/price-list.model");
const hooks = require("./price-list.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/price-list", new PriceList(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("price-list");

  service.hooks(hooks);
};
