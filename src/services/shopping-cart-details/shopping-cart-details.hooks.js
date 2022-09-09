const registerShoppingCartDetails = require("./hooks/register-shopping-cart-details");
const registerProduct = require("./hooks/register-product");
const patchProduct = require("./hooks/patch-product");
const { discard, iff, isProvider, fastJoin } = require("feathers-hooks-common");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const restricRemove = require("./hooks/restrict-remove");
const { paramsFromClient } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.product] = await Promise.all([
        context.app
          .service("products")
          .getModel()
          .query()
          .select("id", "name", "quantity")
          .where({ id: records.product_id })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [paramsFromClient("token")],
    find: [iff(isProvider("external") /* restrictGet() */)],
    get: [iff(isProvider("external") /* restrictGet() */)],
    create: [registerShoppingCartDetails(), registerProduct()],
    update: [],
    patch: [
      iff(
        isProvider("external"),
        discard("shopping_cart_id", "shop_type", "product_id", "deletedAt")
      ),
      patchProduct(),
    ],
    remove: [restricRemove(), removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
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
