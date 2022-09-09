// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { NotFound } = require("@feathersjs/errors");
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { isNumber } = require("lodash");

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

    let taxRule = null;

    if (records.tax_value === undefined || isNaN(records.tax_value)) {
      return context;
    }

    taxRule = await context.app
      .service("tax-rule")
      .getModel()
      .query()
      .where({ value: records.tax_value, deletedAt: null })
      .then((it) => it[0]);

    if (!taxRule) {
      taxRule = await context.app
        .service("tax-rule")
        .create({ name: `${records.tax_value}`, value: records.tax_value });
    }

    records.price_with_tax =
      records.price + (records.price * records.tax_value) / 100;

    records.tax_rule_id = taxRule.id;
    delete records.tax_value;

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
