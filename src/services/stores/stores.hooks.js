const authentication = require('@feathersjs/authentication');
const searchAdmin = require('./hooks/searchAdmin');
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { paramsFromClient } = require('feathers-hooks-common');
const populate = require('../../hooks/populate');

const { authenticate } = authentication.hooks;

module.exports = {
  before: {
    all: [paramsFromClient('joins')],
    find: [searchAdmin()],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt'), removeSoftDelete()]
  },

  after: {
    all: [],
    find: [populate()],
    get: [populate()],
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
