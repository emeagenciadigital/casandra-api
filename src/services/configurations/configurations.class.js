const { Service } = require('feathers-objection');

exports.Configurations = class Configurations extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
