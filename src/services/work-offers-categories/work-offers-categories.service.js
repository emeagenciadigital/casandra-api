// Initializes the `users-addresses` service on path `/addresses`
const { WorkOffersCategories } = require("./work-offers-categories.class");
const createModel = require("../../models/work-offers-categories.model");
const hooks = require("./work-offers-categories.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/work-offers-categories", new WorkOffersCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("work-offers-categories");

  service.hooks(hooks);
};
