const { disallow } = require("feathers-hooks-common");
const webhookEventHook = require("./hooks/webhook-event.hook");


module.exports = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    create: [webhookEventHook()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
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
