const assingPathCategory = require('./hooks/assing-path-category');
const pushAlgolia = require('./hooks/push-algolia');
const prepareRecordsForAlgolia = require('./hooks/prepare-records-for-algolia');
const updateAlgolia = require('./hooks/update-algolia');
const registerProduct = require('./hooks/register-product');
const searhAdmin = require('./hooks/search-admin');
const asingTaxDiscountAdmin = require('./hooks/asing-tax-discount-admin');
const joinGet = require('./hooks/joins');
const {
  fastJoin,
  isProvider,
  iff,
  paramsFromClient,
  discard,
} = require('feathers-hooks-common');
const remSyncAlgolia = require('./hooks/rem-sync-algolia');
const assingTaxtIntegration = require('./hooks/asing-tax-integration');
const assingSlug = require('./hooks/asing-slug');
const assingSlugPatch = require('./hooks/asing-slug-patch');
const topSelledProducts = require('./hooks/top-selled-products');
const assingTaxtInternal = require('./hooks/asing-tax-internal');
const assingTaxAdmin = require('./hooks/asing-tax-admin');
const responseIntegration = require('./hooks/response-integration');
const switchImages = require('./hooks/switch-images');
const sanitationProductName = require('./hooks/sanitation-product-name');
const removeSoftDelete = require('../../hooks/remove-softdelete');
const updateIntegrationHash = require('./hooks/updateIntegrationHash');
const assignLabelToProducts = require('../../hooks/assignLabelToProducts');

const updateLabelProduct = () => context =>
  assignLabelToProducts(undefined, context.result.id)(context)


module.exports = {
  before: {
    all: [],
    find: [
      searhAdmin(),
      paramsFromClient('top', 'category_id', 'integration'),
      topSelledProducts(),
      responseIntegration(),
    ],
    get: [
      searhAdmin(),
      paramsFromClient('top', 'category_id', 'integration'),
      topSelledProducts(),
      responseIntegration(),
    ],
    create: [
      discard('label_end_date','label_id','label_path','label_position','label_start_date'),
      registerProduct(),
      assingPathCategory(),
      assingTaxtIntegration(),
      assingTaxAdmin(),
      sanitationProductName(),
      /* asingTaxDiscountAdmin(), */
    ],
    update: [],
    patch: [
      assingPathCategory(),
      switchImages(),
      /* assingTaxtInternal(), */
      assingTaxtIntegration(),
      iff(isProvider('external'), assingTaxAdmin(), asingTaxDiscountAdmin()),
      prepareRecordsForAlgolia(),
      sanitationProductName(),
    ],
    remove: [remSyncAlgolia()],
  },

  after: {
    all: [
      fastJoin(joinGet),
    ],
    find: [],
    get: [],
    create: [
      assingSlug(),
      updateLabelProduct(),
    ],
    update: [],
    patch: [
      assingSlugPatch(),
      updateIntegrationHash(),
      updateAlgolia(),
      updateLabelProduct(),
    ],
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
