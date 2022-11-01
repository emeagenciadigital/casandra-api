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
    ],
    update: [restrict()],
    patch: [
      discard(
        'verification_amount',
        'verified_status',
        'verification_attempts',
        'user_id',
        'credit_card_token_id',
        'owner_name',
        'customer_id',
        'cvv',
        'type_document',
        'identification_number',
        'exp_year',
        'exp_month',
        'gateway_verification_ref',
        'credit_card_source_payment_id',
      )
    ],
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
        'deletedAt',
        'verification_amount',
        'gateway_verification_ref',
        'credit_card_source_payment_id',
        'credit_card_token_id',
      )
    ],
    find: [],
    get: [],
    create: [
      toggleActiveCard(),
    ],
    update: [],
    patch: [toggleActiveCard()],
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
