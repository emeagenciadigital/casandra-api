// Initializes the `users-addresses` service on path `/addresses`
const { CourseBenefits } = require("./course-benefits.class");
const createModel = require("../../models/course-benefits.model");
const hooks = require("./course-benefits.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/course-benefits", new CourseBenefits(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("course-benefits");

  service.hooks(hooks);
};
