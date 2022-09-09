// Initializes the `documentos-ped` service on path `/documentos-ped`
const { DocumentosPed } = require("./documentos-ped.class");
const hooks = require("./documentos-ped.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/documentos-ped", new DocumentosPed(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("documentos-ped");

  service.hooks(hooks);
};
