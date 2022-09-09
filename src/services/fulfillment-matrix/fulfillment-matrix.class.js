const { Service } = require('feathers-objection');

exports.FulfillmentMatrix = class FulfillmentMatrix extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
