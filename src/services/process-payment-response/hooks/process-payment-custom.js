// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");
const discountStockProductuExpress = require("../../../hooks/discount-stock-express-products");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    if (records.type == "wallet") {
      const [customPayment] = await Promise.all([
        context.app
          .service("custom-payments")
          .getModel()
          .query()
          .where({ id: records.custom_payment_id })
          .then((it) => it[0]),
      ]);

      let status = "rejected";
      switch (records.response_code) {
        //PAGO EXITOSO
        case 1:
          status = "paid";

          break;

        case 2:
          //PAGO RECHAZADO
          status = "rejected";

          break;

        case 3:
          //PAGO PENDIENTE
          status = "pending_payment";
          //se tiene que guardar en el historial el pago rechazado
          break;

        default:
          //PAGO RECHAZADO
          status = "rejected";
          break;
      }

      await Promise.all([
        context.app
          .service("custom-payments")
          .getModel()
          .query()
          .patch({ status })
          .where({ id: customPayment.id }),
      ]);

      context.data = {
        custom_payment: customPayment,
        responseCode: records.response_code,
        paymentInfo: records.payment_info,
      };

      delete records.type;
    }

    replaceItems(context, records);

    return context;
  };
};
