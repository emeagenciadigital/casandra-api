const { iff, isProvider, discard } = require('feathers-hooks-common');
const addCreateByUserIdHook = require('./hooks/add-create-by-user-id.hook');

const discardFields = () => iff(
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

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [discardFields(), iff(isProvider('external'), addCreateByUserIdHook())],
    update: [discardFields()],
    patch: [discardFields()],
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
