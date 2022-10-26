// Initializes the `users-addresses` service on path `/addresses`
const { CourseSections } = require("./course-sections.class");
const createModel = require("../../models/course-sections.model");
const hooks = require("./course-sections.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/course-sections", new CourseSections(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-sections");

  service.hooks(hooks);
};
