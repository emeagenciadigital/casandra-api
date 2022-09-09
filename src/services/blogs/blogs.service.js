// Initializes the `blogs` service on path `/blogs`
const { Blogs } = require('./blogs.class');
const createModel = require('../../models/blogs.model');
const hooks = require('./blogs.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blogs', new Blogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blogs');

  service.hooks(hooks);
};
