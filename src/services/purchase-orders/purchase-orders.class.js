const { Service } = require('feathers-objection');

exports.PurchaseOrders = class PurchaseOrders extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
