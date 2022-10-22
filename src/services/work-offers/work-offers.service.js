// Initializes the `users-addresses` service on path `/addresses`
const { WorkOffers } = require("./work-offers.class");
const createModel = require("../../models/work-offers.model");
const hooks = require("./work-offers.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/work-offers", new WorkOffers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("work-offers");

  service.hooks(hooks);
};
