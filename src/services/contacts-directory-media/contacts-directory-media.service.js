// Initializes the `users-addresses` service on path `/addresses`
const { ContactsDirectoryMedia } = require("./contacts-directory-media.class");
const createModel = require("../../models/contacts-directory-media.model");
const hooks = require("./contacts-directory-media.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/contacts-directory-media", new ContactsDirectoryMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("contacts-directory-media");

  service.hooks(hooks);
};
