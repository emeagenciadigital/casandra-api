const { iff, isProvider, discard } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [iff(
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
    )],
    update: [iff(
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
    )],
    patch: [iff(
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
    )],
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
