const { Service } = require('feathers-objection');

exports.Contact = class Contact extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
