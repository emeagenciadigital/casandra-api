// Initializes the `users-addresses` service on path `/addresses`
const { UserCourses } = require("./user-courses.class");
const createModel = require("../../models/user-courses.model");
const hooks = require("./user-courses.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-courses", new UserCourses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-courses");

  service.hooks(hooks);
};
