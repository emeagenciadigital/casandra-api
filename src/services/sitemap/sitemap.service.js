// Initializes the `sitemap` service on path `/sitemap`
const { Sitemap } = require("./sitemap.class");
const hooks = require("./sitemap.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/sitemap", new Sitemap(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("sitemap");

  service.hooks(hooks);
};
