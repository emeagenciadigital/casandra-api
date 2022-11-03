// Initializes the `users-addresses` service on path `/addresses`
const { UserGatewayTransactions } = require("./user-gateway-transactions.class");
const { createModel } = require("../../models/user-gateway-transactions.model");
const hooks = require("./user-gateway-transactions.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-gateway-transactions", new UserGatewayTransactions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-gateway-transactions");

  service.hooks(hooks);
};
