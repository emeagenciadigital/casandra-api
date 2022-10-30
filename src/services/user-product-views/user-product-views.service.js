// Initializes the `users-addresses` service on path `/addresses`
const { UserProductViews } = require("./user-product-views.class");
const createModel = require("../../models/user-product-views.model");
const hooks = require("./user-product-views.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-product-views", new UserProductViews(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-product-views");

  service.hooks(hooks);
};
