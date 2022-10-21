// Initializes the `users-addresses` service on path `/addresses`
const { ContactDirectoryAttributes } = require("./contacts-directory-attributes.class");
const createModel = require("../../models/contacts-directory-attributes.model");
const hooks = require("./contacts-directory-attributes.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/contacts-directory-attributes", new ContactDirectoryAttributes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("contacts-directory-attributes");

  service.hooks(hooks);
};
