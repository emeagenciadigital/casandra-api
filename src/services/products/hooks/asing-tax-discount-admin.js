// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { NotFound } = require("@feathersjs/errors");
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    if (user.role !== "admin") return context;
    
    const getProduct = async (id) => {
      return await context.app
        .service("products")
        .getModel()
        .query()
        .where({ id })
        .then((it) => it[0]);
    };

    const getTax = async (id) => {
      return await context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id, deletedAt: null })
        .then((it) => it[0]);
    };

    if (records.discount_price && records.discount_price != null) {
      if (records.discount_price != null && !records.tax_rule_id) {
        const product = await getProduct(context.id);

        const tax = await getTax(product.tax_rule_id);

        records.discount_price_whit_tax =
          records.discount_price + (records.discount_price * tax.value) / 100;
      }
    } else if (
      records.discount_price &&
      records.discount_price != null &&
      records.tax_rule_id
    ) {
      const product = await getProduct(context.id);

      const tax = await getTax(product.tax_rule_id);

      records.discount_price_whit_tax =
        records.discount_price + (records.discount_price * tax.value) / 100;
    } else if (records.tax_rule_id && !records.discount_price) {
      const tax = await getTax(records.tax_rule_id);
      const product = await getProduct(context.id);

      records.discount_price_whit_tax =
        product.discount_price + (product.discount_price * tax.value) / 100;
    } else if (records.discount_price && records.discount_price == null) {
      records.discount_price_whit_tax = null;
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
