// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const [quantityImages, product] = await Promise.all([
      context.app
        .service("products-media")
        .getModel()
        .query()
        .count("id", { as: "quantityImages" })
        .where({ deletedAt: null, product_id: records.product_id, type: 'image' })
        .then((it) => it[0].quantityImages),
      context.app
        .service("products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null })
        .then((it) => it[0]),
    ]);

    if (!product) throw new NotFound("No se encontró el producto.");

    if (quantityImages > 0 && product.images == "false") {
      await context.app
        .service("products")
        .getModel()
        .query()
        .patch({ images: "true" })
        .where({ id: product.id });
    } else if (quantityImages < 1 && product.images == "true") {
      await context.app
        .service("products")
        .getModel()
        .query()
        .patch({ images: "false" })
        .where({ id: product.id });
    }

    replaceItems(context, records);

    return context;
  };
};
