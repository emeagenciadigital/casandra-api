const { Service } = require('feathers-objection');

exports.UserProductsViews = class UserProductsViews extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
