// Initializes the `users-addresses` service on path `/addresses`
const { UserPayments } = require("./user-payments.class");
const createModel = require("../../models/user-payments.model");
const hooks = require("./user-payments.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-payments", new UserPayments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-payments");

  service.hooks(hooks);
};
