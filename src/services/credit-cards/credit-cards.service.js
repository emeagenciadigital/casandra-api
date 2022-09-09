// Initializes the `users-credit-cards` service on path `/users-credit-cards`
const { CreditCards } = require("./credit-cards.class");
const createModel = require("../../models/credit-cards.model");
const hooks = require("./credit-cards.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use("/credit-cards", new CreditCards(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("credit-cards");

  service.hooks(hooks);
};
