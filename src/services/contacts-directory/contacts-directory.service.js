// Initializes the `users-addresses` service on path `/addresses`
const { ContactsDirectory } = require("./contacts-directory.class");
const createModel = require("../../models/contacts-directory.model");
const hooks = require("./contacts-directory.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/contacts-directory", new ContactsDirectory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("contacts-directory");

  service.hooks(hooks);
};
