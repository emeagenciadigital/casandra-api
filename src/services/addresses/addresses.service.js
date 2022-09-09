// Initializes the `users-addresses` service on path `/addresses`
const { Addresses } = require("./addresses.class");
const createModel = require("../../models/addresses.model");
const hooks = require("./addresses.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/addresses", new Addresses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("addresses");

  service.hooks(hooks);
};
