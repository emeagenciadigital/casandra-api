// Initializes the `blogs categories` service on path `/blogs-categories`
const { BlogsCategories } = require('./blogs-categories.class');
const createModel = require('../../models/blogs-categories.model');
const hooks = require('./blogs-categories.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blogs-categories', new BlogsCategories(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blogs-categories');

  service.hooks(hooks);
};
