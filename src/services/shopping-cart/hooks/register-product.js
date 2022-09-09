// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const records = getItems(context);

    if (!records.product_id) return context;

    const product = await context.app
      .service("products")
      .getModel()
      .query()
      .where({ id: records.product_id, deletedAt: null, status: "active" })
      .then((it) => it[0]);

    if (!product) throw new NotFound("No se encontró el producto.");

    if (product.quantity < records.quantity && !product.is_ead)
      throw new NotAcceptable(
        "La cantidad supera el stock actual de este producto."
      );

    context.shopping_cart_details = {
      status: true,
      quantity: records.quantity,
      product_id: product.id,
    };

    delete records.product_id;
    delete records.quantity;

    replaceItems(context, records);

    return context;
  };
};
