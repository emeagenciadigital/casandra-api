// Initializes the `users-addresses` service on path `/addresses`
const { CourseRating } = require("./course-rating.class");
const createModel = require("../../models/course-rating.model");
const hooks = require("./course-rating.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/course-rating", new CourseRating(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-rating");

  service.hooks(hooks);
};
