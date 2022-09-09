const { Service } = require('feathers-objection');

exports.DicountConditions = class DicountConditions extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
