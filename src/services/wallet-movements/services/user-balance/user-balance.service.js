// Initializes the `users-addresses` service on path `/addresses`
const { UserBalance } = require("./user-balance.class");
const hooks = require("./user-balance.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/wallet-movements/user/balance", new UserBalance(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("wallet-movements/user/balance");

  service.hooks(hooks);
};
