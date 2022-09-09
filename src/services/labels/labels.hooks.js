const { authenticate } = require('@feathersjs/authentication').hooks;
const assignLabelToProducts = require('../../hooks/assignLabelToProducts');
const removeSoftDelete = require("../../hooks/remove-softdelete");
const removeConditions = require('./hooks/removeConditions');
const removeLabelProducts = require('./hooks/removeLabelProducts');

const updateLabelProduct = () => context =>
  assignLabelToProducts(context.result.id)(context)


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      removeLabelProducts('id'),
      updateLabelProduct()
    ],
    remove: [
      removeLabelProducts('id'),
      removeConditions()
    ]
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
