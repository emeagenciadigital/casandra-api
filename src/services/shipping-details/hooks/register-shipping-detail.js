// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let orderDetail,
      shipping,
      order = null;

    if (records.quantity <= 0)
      throw new NotAcceptable("Debes enviar una cantidad valida.");

    orderDetail = await context.app
      .service("orders-details")
      .getModel()
      .query()
      .where({
        id: records.order_detail_id,
        order_id: records.order_id,
      })
      .then((it) => it[0]);

    order = await context.app
      .service("orders")
      .getModel()
      .query()
      .where({
        id: records.order_id,
      })
      .whereIn("order_status_id", [3, 5, 6, 7])
      .then((it) => it[0]);

    if (!order) throw new NotFound("No se encontró la orden.");

    shipping = await context.app
      .service("shipping")
      .getModel()
      .query()
      .where({
        id: records.shipping_id,
        order_id: order.id,
      })
      .whereIn("shipping_status_id", [1, 4])
      .then((it) => it[0]);

    if (!orderDetail)
      throw new NotFound("No se encontró el detalle de la orden.");
    if (!shipping) throw new NotFound("No se encontró el envio.");

    const shippingDetails = await context.app
      .service("shipping-details")
      .getModel()
      .query()
      .where({
        shipping_id: records.shipping_id,
        order_detail_id: records.order_detail_id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (shippingDetails)
      throw new NotAcceptable(
        "Este producto ya se encuenta agregado al envio."
      );

    const sumDetailsInPreparation = await context.app
      .service("shipping-details")
      .getModel()
      .query()
      .sum("quantity as sum")
      .where({
        order_detail_id: records.order_detail_id,
        deletedAt: null,
      })
      .then((it) => parseInt(it[0].sum));

    if (orderDetail.quantity < records.quantity + orderDetail.sent)
      throw new NotAcceptable(
        "No se puede ingresar cantidad por que supera la cantidad comprada."
      );

    const sum = sumDetailsInPreparation + records.quantity;

    if (sum > orderDetail.quantity)
      throw new NotAcceptable(
        "Cantidad enviada con error ya que en prepacion se encuentra una cantidad y mas esta cantidad superan la cantidad por enviar."
      );

    replaceItems(context, records);

    return context;
  };
};
