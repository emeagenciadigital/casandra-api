const { Service } = require('feathers-objection');

exports.OrdersDetails = class OrdersDetails extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
