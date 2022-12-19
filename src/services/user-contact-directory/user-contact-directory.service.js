// Initializes the `users-addresses` service on path `/addresses`
const { UserContactDirectory } = require("./user-contact-directory.class");
const createModel = require("../../models/user-contact-directory.model");
const hooks = require("./user-contact-directory.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-contact-directory", new UserContactDirectory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-contact-directory");

  service.hooks(hooks);
};
