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
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);
    2;
    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    const records = getItems(context);

    // const algoliaCredemtials = context.app.get("algolia");

    // const Algolia = new algolia(
    //   "blogsAndGuides",
    //   algoliaCredemtials.appId,
    //   algoliaCredemtials.apiKey
    // );

    const meilisearch = context.app.service('meilisearch')

    if (records.status == "active") {
      // records.objectID = parseInt(records.id);
      // records.id = `blog-${records.id}`
      records.description ? delete records.description : null;
      records.createdAtUnix = Math.floor(records.createdAt / 1000);
      // Algolia.save(records);
      meilisearch.patch(null, {
        ...records,
        id: `blog-${records.id}`,
        real_id: records.id,
        type: 'blog'
      })
    } else if (records.status == "inactive") {
      // Algolia.remove(records.id);
      meilisearch.remove(`blog-${records.id}`)
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
