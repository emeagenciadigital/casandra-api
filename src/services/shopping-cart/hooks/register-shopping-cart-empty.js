// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    if (!records.type)
      throw new NotAcceptable(
        "Debes enviar el tipo de carro de compras.['credit','paid_in_full']"
      );

    const shoppingCart = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({
        user: user.id,
        status: "active",
        deletedAt: null,
        type: records.type,
      })
      .then((it) => it[0]);

    if (shoppingCart)
      throw new NotAcceptable("Tienes un carro de compras activo.");

    records.user_id = user.id;
    records.status = "active";

    replaceItems(context, records);

    return context;
  };
};
