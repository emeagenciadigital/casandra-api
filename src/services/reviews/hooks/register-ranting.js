const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");

module.exports = function (options = {}) {
  return async (context) => {
    checkContext(context, null, ["create"]);

    const { user } = context.params;

    const records = getItems(context);
    const ORDER_STATUS_ACEPTED = 3;

    const [product, order] = await Promise.all([
      context.app
        .service("products")
        .getModel()
        .query()
        .where({
          id: records.product_id,
          deletedAt: null,
        })
        .limit(1)
        .then((it) => it[0]),
      context.app
        .service("orders")
        .getModel()
        .query()
        .where({
          id: records.order_id,
          user_id: user.id,
          deletedAt: null,
        })
        .limit(1)
        .then((it) => it[0]),
    ]);

    if (!order) throw new NotFound("No se encontró la orden.");

    if (order.order_status_id !== ORDER_STATUS_ACEPTED)
      throw new NotAcceptable("No se puede");
    if (!product) throw new NotFound("No se encontró el producto.");

    const orderDetails = await context.app
      .service("orders-details")
      .getModel()
      .query()
      .where({ product_id: product.id, order_id: order.id, deletedAt: null })
      .andWhere("sent", ">", 0)
      .then((it) => it[0]);

    if (!orderDetails)
      throw new NotAcceptable(
        "No se encontro el producto en los items de la orden."
      );
    
    if (records.score > 5 || records.score < 1)
      throw new NotAcceptable("Debes enviar una puntuación valida.");

    records.user_id = user.id;

    replaceItems(context, records);
    return context;
  };
};

const error = (type, msg) => {
  throw new type(msg);
};
