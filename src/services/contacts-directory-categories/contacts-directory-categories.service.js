// Initializes the `users-addresses` service on path `/addresses`
const { ContactsDirectoryCategories } = require("./contacts-directory-categories.class");
const createModel = require("../../models/contacts-directory-categories.model");
const hooks = require("./contacts-directory-categories.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/contacts-directory-categories", new ContactsDirectoryCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("contacts-directory-categories");

  service.hooks(hooks);
};
