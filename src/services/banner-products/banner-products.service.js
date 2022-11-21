// Initializes the `users-addresses` service on path `/addresses`
const { BannerProducts } = require("./banner-products.class");
const createModel = require("../../models/banner-products.model");
const hooks = require("./banner-products.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/banner-products", new BannerProducts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("banner-products");

  service.hooks(hooks);
};
