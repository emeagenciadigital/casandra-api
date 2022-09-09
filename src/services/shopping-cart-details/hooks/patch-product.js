// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    const shoppingCartDetails = await context.app
      .service("shopping-cart-details")
      .getModel()
      .query()
      .where({ id: context.id, deletedAt: null })
      .then((it) => it[0]);

    if (!shoppingCartDetails) throw new NotFound("No se encontró el registro.");

    const query = {
      deletedAt: null,
      status: "active",
    };

    if (records.token) {
      query.token = records.token;
    } else if (user) {
      query.user_id = user.id;
    } else
      throw new NotAcceptable("Debes estar autenticado o enviar el token.");

    const [shoppingCart, product] = await Promise.all([
      context.app
        .service("shopping-cart")
        .getModel()
        .query()
        .where({
          id: shoppingCartDetails.shopping_cart_id,
          ...query,
        })
        .then((it) => it[0]),
      context.app
        .service("products")
        .getModel()
        .query()
        .where({
          id: shoppingCartDetails.product_id,
          status: "active",
          deletedAt: null,
        })
        .then((it) => it[0]),
    ]);

    if (!shoppingCart)
      throw new NotFound("No se encontró el carro de compras.");

    if (!product) throw new NotFound("No se encontró el producto.");

    if (product.quantity < records.quantity && !product.is_ead)
      throw new NotAcceptable(
        "La cantidad supera el stock actual de este producto."
      );

    records.token ? delete records.token : null;
    replaceItems(context, records);

    return context;
  };
};
