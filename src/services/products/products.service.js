// Initializes the `express-products` service on path `/express-products`
const { Products } = require("./products.class");
const createModel = require("../../models/products.model");
const hooks = require("./products.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    whitelist: ["$eager", "$joinRelation"],
    allowedEager: "[category, category_2, category_3, brand, tax, hubs, media]",
    multi: true,
    paginate: {
      max: 50000,
      default: 50,
    },
  };

  // Initialize our service with any options it requires
  app.use("/products", new Products(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("products");

  service.hooks(hooks);
};
