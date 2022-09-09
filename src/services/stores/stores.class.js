const { Service } = require('feathers-objection');

exports.Stores = class Stores extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
