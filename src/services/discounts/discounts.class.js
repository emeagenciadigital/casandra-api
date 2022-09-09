const { Service } = require('feathers-objection');

exports.Discounts = class Discounts extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
