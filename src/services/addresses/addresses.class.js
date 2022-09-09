const { Service } = require("feathers-objection");

exports.Addresses = class Addresses extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model,
    });
  }
};
