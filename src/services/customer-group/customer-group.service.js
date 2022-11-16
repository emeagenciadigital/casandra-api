// Initializes the `users-addresses` service on path `/addresses`
const { CustomerGroup } = require("./customer-group.class");
const createModel = require("../../models/customer-group.model");
const hooks = require("./customer-group.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/customer-group", new CustomerGroup(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("customer-group");

  service.hooks(hooks);
};
