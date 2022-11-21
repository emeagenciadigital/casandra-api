// Initializes the `users-addresses` service on path `/addresses`
const { UserWorkOffers } = require("./user-work-offers.class");
const createModel = require("../../models/user-work-offers.model");
const hooks = require("./user-work-offers.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-work-offers", new UserWorkOffers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-work-offers");

  service.hooks(hooks);
};
