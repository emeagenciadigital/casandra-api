const { authenticate } = require('@feathersjs/authentication').hooks;
const assignLabelToProducts = require('../../hooks/assignLabelToProducts');
const removeLabelProducts = require('./hooks/removeLabelProducts');
const removeSoftDelete = require("../../hooks/remove-softdelete");

const updateLabelProduct = () => context =>
  assignLabelToProducts(context.result.label_id)(context)

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      removeSoftDelete()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      updateLabelProduct()
    ],
    update: [],
    patch: [
      removeLabelProducts('label_id'),
      updateLabelProduct()
    ],
    remove: [
      removeLabelProducts('label_id')
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
