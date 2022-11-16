// Initializes the `users-addresses` service on path `/addresses`
const { PriceListCustomerGroups } = require("./price-list-customer-groups.class");
const createModel = require("../../models/price-list-customer-groups.model");
const hooks = require("./price-list-customer-groups.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/price-list-customer-groups", new PriceListCustomerGroups(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("price-list-customer-groups");

  service.hooks(hooks);
};
