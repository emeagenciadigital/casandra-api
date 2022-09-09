// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable, NotFound } = require("@feathersjs/errors");
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerExpressProductsOrdersHistory = require("../../../hooks/register-products-orders-history");
const registerOrderHistory = require("../../../hooks/register-order-history");
const registerCoffeeOrderHistory = require("../../../hooks/register-coffee-order-history");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const { shippingDetails, order } = context;

    if (records.shipping_status_id == 2 || records.shipping_status_id == 4) {
      let [buyItems, sentItems] = [null, null];

      for (const shippingDetail of shippingDetails) {
        const orderDetails = await context.app
          .service("orders-details")
          .getModel()
          .query()
          .where({ id: shippingDetail.order_detail_id })
          .then((it) => it[0]);

        await Promise.all([
          context.app
            .service("orders-details")
            .getModel()
            .query()
            .where({ id: shippingDetail.order_detail_id })
            .increment("sent", shippingDetail.quantity),
          context.app
            .service("shipping")
            .getModel()
            .query()
            .where({
              id: shippingDetail.shipping_id,
              shipping_status_id: 4,
            })
            .increment(
              "pending_payment",
              shippingDetail.quantity * orderDetails.unit_price_tax_incl
            ),
        ]);

        //ERROR AQUI NO ENCUENTRA EL ORDER DETAILS
        //ahora buscar cuando sea una order tipo coffee y sumar hacer la misma consulta de arriba
      }

      [buyItems, sentItems] = await Promise.all([
        context.app
          .service("orders-details")
          .getModel()
          .query()
          .sum("quantity as sum")
          .where({ order_id: records.order_id })
          .then((it) => parseInt(it[0].sum)),
        context.app
          .service("orders-details")
          .getModel()
          .query()
          .sum("sent as sum")
          .where({ order_id: records.order_id })
          .then((it) => parseInt(it[0].sum)),
      ]);

      let order_status_id = null;
      if (buyItems == sentItems || sentItems > buyItems) {
        order_status_id = 8;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });
      } else {
        order_status_id = 7;
        await context.app
          .service("orders")
          .getModel()
          .query()
          .patch({ order_status_id: order_status_id })
          .where({ id: records.order_id });

        // complete = false;
      }

      /* aqui todas deben ser completas para que pueda cambiarse el estado de la orden principal */
      // const ordersModel = context.app.service("orders").getModel().query();

      // if (complete) {
      //   order_status_id = 8;
      //   await ordersModel
      //     .patch({ order_status_id: order_status_id })
      //     .where({ id: records.order_id });
      // } else {
      //   order_status_id = 7;
      //   await ordersModel
      //     .patch({ order_status_id: order_status_id })
      //     .where({ id: records.order_id });
      // }

      registerOrderHistory({
        order_id: records.order_id,
        order_status_id: order_status_id,
        company_id: order.company_id,
      })(context);
    }

    replaceItems(context, records);

    return context;
  };
};
