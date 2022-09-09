const { Service } = require('feathers-objection');

exports.Characteristics = class Characteristics extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
