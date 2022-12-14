const copyTemplateNutritionalTable = require("./hooks/register-template-to-express-product");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [copyTemplateNutritionalTable()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
