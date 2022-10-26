// Initializes the `users-addresses` service on path `/addresses`
const { WalletBonus } = require("./wallet-bonus.class");
const createModel = require("../../models/wallet-bonus.model");
const hooks = require("./wallet-bonus.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/wallet-bonus", new WalletBonus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("wallet-bonus");

  service.hooks(hooks);
};
