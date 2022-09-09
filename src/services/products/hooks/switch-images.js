// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    let product_id = context.id
    if (!product_id) {
      product_id = await context.app
        .service('products')
        .find(context.params)
        .then(it => it.data[0].id)
    }

    const [quantityImages] = await Promise.all([
      context.app
        .service("products-media")
        .getModel()
        .query()
        .count("id", { as: "quantityImages" })
        .where({ deletedAt: null, product_id, type: 'image' })
        .then((it) => it[0].quantityImages),
    ]);

    if (quantityImages > 0) {
      records.images = "true";
    } else if (quantityImages < 1) {
      records.images = "false";
    }

    replaceItems(context, records);

    return context;
  };
};
