// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
const { takeRight } = require("lodash");

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

    if (records.status !== "active") return context;
    const [multimedia, product] = await Promise.all([
      context.app
        .service("products-media")
        .getModel()
        .query()
        .where({
          product_id: context.id,
          type: "image",
          deletedAt: null,
        })
        .limit(1)
        .then((it) => it[0]),
      context.app
        .service("products")
        .getModel()
        .query()
        .where({ id: context.id })
        .then((it) => it[0]),
    ]);

    if (!multimedia)
      throw new NotAcceptable(
        "No se puede activar el producto por que no tiene galería."
      );

    if (records.category_id == 1 && product.category_id == 1)
      throw new NotAcceptable("Debes asignarle una categoría al producto");

    if (!records.category_id && product.category_id == 1)
      throw new NotAcceptable("Debes asignarle una categoría al producto");

    if (records.brand_id == 1 && product.brand_id == 1)
      throw new NotAcceptable("Debes asignarle una marca al producto");

    if (!records.brand_id && product.brand_id == 1)
      throw new NotAcceptable("Debes asignarle una marca al producto");

    // context.params.query = {
    //   // $eager: "[brand,category,category_2,category_3]",
    // };

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
