const { Service } = require('feathers-objection');

exports.LabelsConditions = class LabelsConditions extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
