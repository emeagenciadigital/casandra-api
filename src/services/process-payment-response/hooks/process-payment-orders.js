// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common');
const registerOrderHistory = require('../../../hooks/register-order-history');
const activateShoppingCart = require('../../../hooks/activate-shopping-cart');
const { Op } = require('sequelize');

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
    let isOrderCompleted = false

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

      const orderProducts = await context.app
        .service('products')
        .getModel()
        .query()
        .whereIn('id', orderDetails.map(it => it.product_id))
        .where({ deletedAt: null })
        .then(products => products.reduce((acc, it) => ({ ...acc, [it.id]: it}), {}))

      const productCoursesIds = Object.values(orderProducts)
        .filter(product => product.course === 'true')
        .map(product => product.id)
      
      let orderCourses = {}

      if (productCoursesIds.length) {
        orderCourses = await context.app
          .service('courses')
          .getModel()
          .findAll({
            where: {
              product_id: {
                [Op.in]: productCoursesIds
              }
            }
        })
        .then(courses => {
          return courses.reduce((groupedCourses, course) => {
            if (groupedCourses[course.product_id]) {
              groupedCourses[course.product_id].push(course)
            } else {
              groupedCourses[course.product_id] = [course]
            }
            return groupedCourses
          }, {})
        })

      }

       isOrderCompleted = Object.values(orderProducts).every(product => product.course === 'true')

      for (const key in orderDetails) {
        const orderDetail = orderDetails[key];
        const product = orderProducts[orderDetail.product_id]

        // const product = await context.app
        //   .service('products')
        //   .getModel()
        //   .query()
        //   .where({ id: orderDetail.product_id })
        //   .then(res => res[0])

        if (product) {
          if (product.course === 'false') {
            await context.app
              .service('products')
              .getModel()
              .query()
              .where({ id: orderDetail.product_id })
              .decrement('quantity', orderDetail.quantity);
          } else {
            const productCourses = orderCourses[product.id]
            // const productCourses = await context.app
            //   .service('courses')
            //   .getModel()
            //   .findAll({ where: { product_id: product.id, status: 'active' } })
            await context.app
              .service('user-courses')
              .getModel()
              .bulkCreate(
                productCourses.map(course => ({
                  user_id: order.user_id, course_id: course.id
                }))
              )
          }
        }

      }
    }

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
        order_status_id = isOrderCompleted ? 9 :3;

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
