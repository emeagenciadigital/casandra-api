const { Service } = require('feathers-objection');

exports.ProductsCharacteristics = class ProductsCharacteristics extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
