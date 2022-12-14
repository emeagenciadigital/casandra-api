// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

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

    if (context.params.query.data_value && user.role == "admin") {
      const value = context.params.query.data_value;
      delete context.params.query.data_value;

      const ordersIds = await context.app
        .service("blogs-and-guides")
        .getModel()
        .query()
        .select("blogs_and_guides.id")
        .innerJoin("authors", "blogs_and_guides.author_id", "=", "authors.id")
        .orWhere("blogs_and_guides.title", "LIKE", `%${value}%`)
        .orWhere("authors.name", "LIKE", `%${value}%`)
        .where({ "blogs_and_guides.deletedAt": null })

        .then((it) => it.map((it) => it.id));

      context.params.query = { id: { $in: ordersIds } };
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
