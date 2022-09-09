const { Service } = require('feathers-objection');

exports.Banners = class Banners extends Service {
  constructor(options) {
    const { Model, ...otherOptions } = options;

    super({
      ...otherOptions,
      model: Model
    });
  }
};
