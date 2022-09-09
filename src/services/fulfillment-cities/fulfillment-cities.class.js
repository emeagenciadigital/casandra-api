const { Service } = require('feathers-objection');

exports.FulfillmentCities = class FulfillmentCities extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
