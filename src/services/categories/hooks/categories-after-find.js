// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const lodash = require("lodash");

async function getCategories(context, categories, categoryId) {
  if (categoryId != 1) {
    return await context.app
      .service("categories")
      .getModel()
      .query()
      .where({ id: categoryId })
      .then(async (result) => {
        if (result[0].parent_id >= 2) {
          categories.push(
            await getCategories(context, categories, result[0].parent_id)
          );
        }
        return result;
      });
  }
}

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
    let records = getItems(context);

    if (context.params.tree == "true") {
      const getPathCategory = async (id) => {
        const temp_categories = [];

        temp_categories.push(await getCategories(context, temp_categories, id));

        const categories = {};
        const contentCategoriesId = [];
        for (let a = 0; a < temp_categories.length; a++) {
          let categoriesId = {};

          if (categories["lvl" + (a - (a !== 0 ? 1 : 0))]) {
            categoriesId = temp_categories[a][0].id;
            categories["lvl" + a] =
              categories["lvl" + (a - (a !== 0 ? 1 : 0))] +
              " > " +
              temp_categories[a][0].name;
          } else {
            if (temp_categories[0]) {
              categoriesId = temp_categories[0][a].id;
              categories["lvl" + a] = temp_categories[0][a].name;
            }
          }
          contentCategoriesId.push(categoriesId);
        }

        return categories;
      };

      const getChildren = async (parent_id) => {
        const categories = lodash.orderBy(
          records.filter((it) => it.parent_id === parent_id),
          ["priority"],
          ["desc"]
        );
        for (let index = 0; index < categories.length; index++) {
          const category = categories[index];
          category.path = Object.values(
            await getPathCategory(category.id)
          ).pop();
          category.children = await getChildren(category.id);
        }

        return categories;
      };

      const tree = await getChildren(1);
      records = tree;
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
