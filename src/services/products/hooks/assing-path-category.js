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

    const x = (parent_id) => {
      return new Promise(async (resolve) => {
        let r = [];
        r.push(
          await context.app.service("categories").get(parent_id, {
            query: {
              $select: ["id", "parent_id"],
            },
          })
        );
        if (r[r.length - 1].parent_id != 0) {
          r = [...(await x(r[r.length - 1].parent_id)), ...r];
          resolve(r);
        } else {
          resolve(r);
        }
      });
    };

    if (records.category_id && records.category_id != 1) {
      const a = await x(records.category_id);

      a.pop();
      records.category_path_ids = `-${a.map((it) => it.id).join("-")}-${
        records.category_id
      }-`;
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
