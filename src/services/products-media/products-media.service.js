// Initializes the `express-products-media` service on path `/express-products-media`
const { ExpressProductsMedia } = require("./products-media.class");
const createModel = require("../../models/products-media.model");
const hooks = require("./products-media.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use("/products-media", new ExpressProductsMedia(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("products-media");

  service.hooks(hooks);
};
