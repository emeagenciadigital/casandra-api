const { Service } = require('feathers-objection');

exports.Labels = class Labels extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
