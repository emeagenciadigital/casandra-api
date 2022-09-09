// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = () => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    const shoppingCartModel = context.app.service("shopping-cart").getModel();

    const shoppingCart = await shoppingCartModel
      .query()
      .where({ id: context.id, deletedAt: null, status: "active" })
      .whereNotNull("token")
      .then((it) => it[0]);

    if (!shoppingCart)
      throw new NotFound("No se encontró el carro de compras.");

    // PREGUNTARLE A DANIEL
    await shoppingCartModel
      .query()
      .patch({ status: "inactive" })
      .where({ user_id: user.id });

    records.user_id = user.id;

    records.token = null;

    replaceItems(context, records);

    return context;
  };
};
