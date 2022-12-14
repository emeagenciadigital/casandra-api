// Initializes the `categories` service on path `/categories`
const { categories } = require("./categories.class");
const createModel = require("../../models/categories.model");
const hooks = require("./categories.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: {
      max: 5000,
      default: 200,
    },
  };

  // Initialize our service with any options it requires
  app.use("/categories", new categories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("categories");

  service.hooks(hooks);
};
