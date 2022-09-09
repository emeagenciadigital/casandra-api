// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (!context.id) throw new NotAcceptable("Debes enviar el id.");

    if (records.quantity <= 0)
      throw new NotAcceptable("La cantidad debe ser mayor a 0.");

    const shipingDetail = await context.app
      .service("shipping-details")
      .getModel()
      .query()
      .where({ id: context.id })
      .then((it) => it[0]);

    if (!shipingDetail)
      throw new NotFound("No se encontró el detalle del envío.");

    const shipping = await context.app
      .service("shipping")
      .getModel()
      .query()
      .where({
        id: shipingDetail.shipping_id,
        deletedAt: null,
      })
      .whereIn("shipping_status_id", [1, 4])
      .then((it) => it[0]);

    if (!shipping) throw new NotFound("No se encontró el envío.");

    const orderDetail = await context.app
      .service("orders-details")
      .getModel()
      .query()
      .where({
        id: shipingDetail.order_detail_id,
        order_id: shipingDetail.order_id,
      })
      .then((it) => it[0]);

    if (!orderDetail)
      throw new NotFound("No se encontró el detalle de la orden.");

    if (orderDetail.quantity < records.quantity + orderDetail.sent)
      throw new NotAcceptable(
        "No se puede ingresar cantidad por que supera la cantidad comprada."
      );

    replaceItems(context, records);

    return context;
  };
};
