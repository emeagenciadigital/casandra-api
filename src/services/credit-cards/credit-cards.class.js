const { Service } = require("feathers-objection");

exports.CreditCards = class CreditCards extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model,
    });
  }
};
