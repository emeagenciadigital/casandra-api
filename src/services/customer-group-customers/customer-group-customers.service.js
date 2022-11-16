// Initializes the `users-addresses` service on path `/addresses`
const { CustomerGroupCustomers } = require("./customer-group-customers.class");
const createModel = require("../../models/customer-group-customers.model");
const hooks = require("./customer-group-customers.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: ['create']
  };

  // Initialize our service with any options it requires
  app.use("/customer-group-customers", new CustomerGroupCustomers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("customer-group-customers");

  service.hooks(hooks);
};
