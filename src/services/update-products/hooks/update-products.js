// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common');
// const { NotFound, NotAcceptable } = require('@feathersjs/errors');
// const { parseInt } = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    // const { user } = context.params;

    const records = getItems(context);

    const products = await context.app
      .service('products')
      .getModel()
      .query()
      .where({ deletedAt: null, status: 'active' });

    for (const key in products) {
      const product = products[key];
      // console.log(product, 'pppp');
      await context.app.service('products').patch(product.id, {});
    }

    replaceItems(context, records);

    return context;
  };
};
