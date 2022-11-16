const deleteRelationshipsHook = require("./hooks/delete-relationships.hook");
const saveAfterDataHook = require("./hooks/save-after-data.hook");
const updateAfterDataHook = require("./hooks/update-after-data.hook");
const { withAllDataJoin } = require("./price-list.joins");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [withAllDataJoin()],
    create: [saveAfterDataHook(), withAllDataJoin()],
    update: [],
    patch: [updateAfterDataHook(), withAllDataJoin()],
    remove: [deleteRelationshipsHook()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
