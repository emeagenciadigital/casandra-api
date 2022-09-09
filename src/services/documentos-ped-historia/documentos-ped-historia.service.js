// Initializes the `documentos-ped-historia` service on path `/documentos-ped-historia`
const { DocumentosPedHistoria } = require('./documentos-ped-historia.class');
const hooks = require('./documentos-ped-historia.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/documentos-ped-historia', new DocumentosPedHistoria(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('documentos-ped-historia');

  service.hooks(hooks);
};
