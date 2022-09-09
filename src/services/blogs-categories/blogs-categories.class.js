const { Service } = require('feathers-objection');

exports.BlogsCategories = class BlogsCategories extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
