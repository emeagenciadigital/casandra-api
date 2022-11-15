// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common');
const registerOrderHistory = require('../../../hooks/register-order-history');
const activateShoppingCart = require('../../../hooks/activate-shopping-cart');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context)

    if (records.type !== 'orders') return context

    const order = await context.app
      .service('orders')
      .getModel()
      .query()
      .where({ id: records.order_id })
      .then((it) => it[0])

    let order_status_id = null
    let dataNotification = {}

    switch (records.response_code) {
      //PAGO EXITOSO
      case 'success':
      case 'approved':
        dataNotification = {
          type: 'email',
          order: records,
          typeNotification: 'orderPendingShipping',
        };

        //completamos el carro de compras y se envia correo
        await Promise.all([
          context.app
            .service('shopping-cart')
            .getModel()
            .query()
            .patch({ status: 'completed' })
            .where({ id: order.shopping_cart_id }),

          context.app.service('send-notifications').create(dataNotification),
        ]);
        order_status_id = 3;

        break;

      case 'failure':
      case 'cancelled':
        //PAGO RECHAZADO

        order_status_id = 2;

        break;

      case 'pending':
        //PAGO PENDIENTE
        order_status_id = 4;
        //se tiene que guardar en el historial el pago rechazado
        break;

      case 4:
        //PAGO PENDIENTE APROBACION CLIENTE
        order_status_id = 11;
        break;

      default:
        //PAGO RECHAZADO
        order_status_id = 2;
        break;
    }

    await Promise.all([
      context.app
        .service('orders')
        .getModel()
        .query()
        .patch({ order_status_id: order_status_id })
        .where({ id: order.id }),
      registerOrderHistory({
        order_id: order.id,
        order_status_id: order_status_id,
        user_id: order.user_id,
      })(context),
    ]);

    if (
      records.response_code === 'pending' ||
      records.response_code === 'failure'
    ) {
      await activateShoppingCart({ order_id: order.id })(context);
    } else if (
      records.response_code === 'success' ||
      records.response_code === 'approved'
    ) {
      const orderDetails = await context.app
        .service('orders-details')
        .getModel()
        .query()
        .where({ order_id: order.id, deletedAt: null });

      for (const key in orderDetails) {
        const orderDetail = orderDetails[key];
        await context.app
          .service('products')
          .getModel()
          .query()
          .where({ id: orderDetail.product_id })
          // .andWhere(function () {
          //   this.where('is_ead', null).orWhere('is_ead', 0)
          // })
          .decrement('quantity', orderDetail.quantity);
      }
    }

    context.data = {
      order: order,
      responseCode: records.response_code,
      paymentInfo: records.payment_info,
    };

    delete records.type;


    replaceItems(context, records);

    return context;
  };
};
