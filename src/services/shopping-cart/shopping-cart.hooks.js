const registerShoppingCart = require('./hooks/register-shopping-cart');
const registerProduct = require('./hooks/register-product');
const registerProductAfterCreate = require('./hooks/register-products-after-create');
const registerShoppingCartEmpty = require('./hooks/register-shopping-cart-empty');
const assigShoppingCart = require('./hooks/assign-shopping-cart');
const removeShoppingCart = require('./hooks/remove-shoppping-cart');
const filterOwners = require('./hooks/filters-owners');

const {
  disallow,
  paramsFromClient,
  fastJoin,
  isProvider,
  iff,
} = require('feathers-hooks-common');
const { getProductPrices } = require('../../utils/price-list/prices');

const switchRegisterShoppingCartBefore = [
  paramsFromClient('shopping_cart_empty'),
  async (context) => {
    const sce = context.params.shopping_cart_empty;
    if (sce === 'true' || sce === true) {
      await registerShoppingCartEmpty()(context);
      return context;
    } else {
      await registerShoppingCart()(context);
      await registerProduct()(context);
      return context;
    }
  },
];

const switchRegisterShoppingCartAfter = [
  paramsFromClient('shopping_cart_empty'),
  async (context) => {
    if (
      context.params.shopping_cart_empty === 'true' ||
      context.params.shopping_cart_empty === true
    ) {
      return context;
    } else {
      return registerProductAfterCreate()(context);
    }
  },
];

const productsJoins = {
  joins: {
    role: () => async (records, context) => {

      const address = await context.app
        .service('addresses')
        .getModel()
        .findOne({
          where: {
            user_id: records.user_id, main: 'true'
          }
        })
      if (address) {
        // records.shipping_cost = await context.app
        //   .service("search-shipping-cost")
        //   .find({ query: { address_id: address.id } })
        //   .then((it) => it.shippingCost);
      }

      const shopping_cart_details = records.shopping_cart_details;


      if (shopping_cart_details) {
        const productsPrices = await getProductPrices(context.params.user)(shopping_cart_details.map(it => it.product_id))(context)
          .then(res => res.reduce((acc, it) => ({ ...acc, [it.product_id]: it }), {}))
        for (let index = 0; index < shopping_cart_details.length; index++) {
          const product = await context.app
            .service('products')
            .getModel()
            .query()
            .select(
              'products.id',
              'products.name',
              'products.price',
              'products.price_with_tax',
              'products.discount_price',
              'products.discount_price_whit_tax',
              'products.status',
              'products.tax_rule_id',
              'products.course',
              'tax_rule.value AS tax_rule_value',
              'products.deletedAt',
            )
            .leftJoin('tax_rule', 'products.tax_rule_id', '=', 'tax_rule.id')
            .where({
              'products.id': records.shopping_cart_details[index].product_id,
              // 'products.deletedAt': null,
            })
            .then((it) => it[0]);
          if (product && product.deletedAt === null) {
            records.shopping_cart_details[index].product = product;
            records.shopping_cart_details[index].product.price = productsPrices[`${product.id}`].price
            records.shopping_cart_details[index].product.price_with_tax = productsPrices[`${product.id}`].price_with_tax
            records.shopping_cart_details[index].product.discount_price = productsPrices[`${product.id}`].discount_price
            records.shopping_cart_details[index].product.discount_price_whit_tax = productsPrices[`${product.id}`].discount_price_whit_tax
            records.shopping_cart_details[index].product.main_media =
              await context.app
                .service('products-media')
                .getModel()
                .query()
                .where({
                  product_id: records.shopping_cart_details[index].product_id,
                  deletedAt: null,
                })
                .orderBy('priority', 'desc')
                .then((it) => it[0]);
          } else if (product && product.deletedAt !== null) {
            records.shopping_cart_details[index].product = {
              id: product.id,
              name: product.name,
              status: 'deleted',
            };
            records.shopping_cart_details[index].product.main_media =
              await context.app
                .service('products-media')
                .getModel()
                .query()
                .where({
                  product_id: records.shopping_cart_details[index].product_id,
                  deletedAt: null,
                })
                .orderBy('priority', 'desc')
                .then((it) => it[0]);
          } else {
            records.shopping_cart_details[index].product = null;
          }
        }

      }
    },
  },
};

module.exports = {
  before: {
    all: [paramsFromClient('token')],
    find: [
      paramsFromClient('products'),
      iff(isProvider('external'), filterOwners()),
    ],
    get: [
      paramsFromClient('products'),
      iff(isProvider('external'), filterOwners()),
    ],
    create: [...switchRegisterShoppingCartBefore],
    update: [disallow('external')],
    patch: [assigShoppingCart()],
    remove: [removeShoppingCart()],
  },

  after: {
    all: [iff(isProvider('external'), fastJoin(productsJoins))],
    find: [],
    get: [],
    create: [...switchRegisterShoppingCartAfter],
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
