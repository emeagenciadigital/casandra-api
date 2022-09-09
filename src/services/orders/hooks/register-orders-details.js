// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require('@feathersjs/errors');
const { getItems, replaceItems } = require('feathers-hooks-common');
const { query } = require('../../../utils/query-builders/batch-insert');
const moment = require('moment');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const products = context.dataOrders.shoppingCartDetails;
    const priceLists = context.dataOrders.priceLists;

    const data = [];

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      //SI TIENE LISTA DE PRECIOS

      const productPrice = product.discount_price
        ? product.discount_price
        : product.price;

      const tax = (product.tax_value / 100) * productPrice;

      const productMedia = await context.app
        .service('products-media')
        .getModel()
        .query()
        .where({ product_id: product.product_id, deletedAt: null })
        .orderBy('priority', 'desc')
        .then((it) => it[0]);

      delete product.description;

      data.push({
        order_id: records.id,
        product_id: product.product_id,
        unit_price_tax_excl: productPrice,
        quantity: product.shopping_cart_details_quantity,
        unit_price_tax_incl: productPrice + tax,
        unit_price_tax: tax,
        total_price_tax_incl:
          productPrice * product.shopping_cart_details_quantity +
          tax * product.shopping_cart_details_quantity,
        total_price_tax: tax * product.shopping_cart_details_quantity,
        sent: 0,
        product_name: product.product_name,
        product_main_image: productMedia ? productMedia.path : '',
        product_details_meta_data: product,
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      });
    }

    await query.insert(context.app.service('orders-details').getModel(), data);

    replaceItems(context, records);

    return context;
  };
};
