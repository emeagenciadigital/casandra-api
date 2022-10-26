const { iff, isProvider, discard } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [
      iff(
        isProvider('external'),
        discard(
          'created_by_user_id',
          'payment_id',
          'bonus_id',
          'bonus_name',
          'expired_day',
          'expired_status',
          'expired_wallet_movement_id',
        )
      )
    ],
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
