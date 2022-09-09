const { authenticate } = require('@feathersjs/authentication').hooks;
const removeSoftDelete = require("../../hooks/remove-softdelete");
const restrictAction = require('./hooks/restrictAction');
const checkIfApplicable = require('./hooks/checkIfApplicable');
const { paramsFromClient } = require("feathers-hooks-common");

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      paramsFromClient('checkIfApplicable', 'shopping_cart_id'),
      restrictAction()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [removeSoftDelete()]
  },

  after: {
    all: [],
    find: [
      checkIfApplicable()
    ],
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
