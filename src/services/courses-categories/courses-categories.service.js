// Initializes the `users-addresses` service on path `/addresses`
const { CoursesCategories } = require("./courses-categories.class");
const createModel = require("../../models/courses-categories.model");
const hooks = require("./courses-categories.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/courses-categories", new CoursesCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("courses-categories");

  service.hooks(hooks);
};
