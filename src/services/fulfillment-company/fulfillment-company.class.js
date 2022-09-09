const { Service } = require('feathers-objection');

exports.FulfillmentCompany = class FulfillmentCompany extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
