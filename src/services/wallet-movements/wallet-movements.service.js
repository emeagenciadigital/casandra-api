// Initializes the `users-addresses` service on path `/addresses`
const { WalletMovements } = require("./wallet-movements.class");
const createModel = require("../../models/wallet-movements.model");
const hooks = require("./wallet-movements.hooks");
const upServices = require('./services')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/wallet-movements", new WalletMovements(options, app));
  upServices(app)

  // Get our initialized service so that we can register hooks
  const service = app.service("wallet-movements");

  service.hooks(hooks);

};
