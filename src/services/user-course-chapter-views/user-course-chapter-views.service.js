// Initializes the `users-addresses` service on path `/addresses`
const { UserCourseChapterViews } = require("./user-course-chapter-views.class");
const createModel = require("../../models/user-course-chapter-views.model");
const hooks = require("./user-course-chapter-views.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/user-course-chapter-views", new UserCourseChapterViews(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("user-course-chapter-views");

  service.hooks(hooks);
};
