const { Service } = require('feathers-objection');

exports.Blogs = class Blogs extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
