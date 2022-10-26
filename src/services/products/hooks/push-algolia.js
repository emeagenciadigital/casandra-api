// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
// const algolia = require("../../../utils/algolia");

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, ["create", "patch"]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    // const algoliaCredemtials = context.app.get("algolia");

    if (records.status == "active") {

      // const Algolia = new algolia(
      //   "products",
      //   algoliaCredemtials.appId,
      //   algoliaCredemtials.apiKey
      //   );

      // records.objectID = records.id;
      // records.id = `product-${records.id}`
      records.createdAtUnix = Math.floor(records.createdAt / 1000);
      records.updatedAtUnix = Math.floor(records.updatedAt / 1000);
      context.app.service('meilisearch').patch(null, {
        index: 'search',
        records
      })
      // Algolia.create(records);
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
