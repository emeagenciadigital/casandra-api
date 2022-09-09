// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { NotFound } = require("@feathersjs/errors");
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { Container } = require("winston");

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

    if (user && user.role !== "admin") return context;

    if (!records.price_with_tax && records.tax_rule_id && records.price) {
      const tax = await context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: records.tax_rule_id, deletedAt: null })
        .then((it) => it[0]);

      records.price_with_tax =
        records.price + (records.price * tax.value) / 100;
    } else if (records.tax_rule_id && records.price) {
      const price = records.price;

      const tax = await context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: records.tax_rule_id, deletedAt: null })
        .then((it) => it[0]);

      records.price_with_tax = price + (price * tax.value) / 100;
    } else if (records.tax_rule_id && !records.price) {
      const product = await context.app
        .service("products")
        .getModel()
        .query()
        .where({ id: context.id })
        .then((it) => it[0]);

      const tax = await context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: records.tax_rule_id, deletedAt: null })
        .then((it) => it[0]);

      records.price_with_tax =
        product.price + (product.price * tax.value) / 100;

      const pricesList = await context.app
        .service("product-price-list")
        .getModel()
        .query()
        .where({ product_id: product.id });

      if (pricesList.length > 0) {
        for (const key in pricesList) {
          const priceList = pricesList[key];
          const price_with_tax =
            priceList.price + (priceList.price * tax.value) / 100;
          await context.app
            .service("product-price-list")
            .getModel()
            .query()
            .patch({ price_with_tax: price_with_tax })
            .where({ id: priceList.id });
        }
      }
    } else if (!records.tax_rule_id && records.price) {
      const product = await context.app
        .service("products")
        .getModel()
        .query()
        .where({ id: context.id })
        .then((it) => it[0]);

      const tax = await context.app
        .service("tax-rule")
        .getModel()
        .query()
        .where({ id: product.tax_rule_id, deletedAt: null })
        .then((it) => it[0]);

      records.price_with_tax =
        records.price + (records.price * tax.value) / 100;
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
