const { iff, isProvider, discard } = require('feathers-hooks-common');
const removeSoftDelete = require('../../hooks/remove-softdelete');
const restrict = require('../../hooks/restrict');
const toggleActiveCard = require('./hooks/toggle-active-card');


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isProvider('external'), restrict()),
      toggleActiveCard(),
    ],
    update: [],
    patch: [],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [
      discard(
        'customer_id',
        'cvv',
        'type_document',
        'identification_number',
        'meta_data',
        'payment_method',
        'active',
        'city',
        'address',
        'phone',
        'cell_phone',
        'deletedAt')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
