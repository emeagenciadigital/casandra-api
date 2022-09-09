const { Service } = require('feathers-objection');

exports.Catalogs = class Catalogs extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
