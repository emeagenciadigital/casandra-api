// Initializes the `users-addresses` service on path `/addresses`
const { CourseChapters } = require("./course-chapters.class");
const createModel = require("../../models/course-chapters.model");
const hooks = require("./course-chapters.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/course-chapters", new CourseChapters(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-chapters");

  service.hooks(hooks);
};
