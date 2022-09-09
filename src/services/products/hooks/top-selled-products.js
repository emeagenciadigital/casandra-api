// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {
  checkContext,
  getItems,
  replaceItems,
} = require('feathers-hooks-common');
const algolia = require('../../../utils/algolia');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  // Return the actual hook.
  return async (context) => {
    // Throw if the hook is being called from an unexpected location.
    checkContext(context, null, [
      'find',
      'get',
      'create',
      'update',
      'patch',
      'remove',
    ]);

    // Get the authenticated user.
    // eslint-disable-next-line no-unused-vars
    const { user } = context.params;
    // Get the record(s) from context.data (before), context.result.data or context.result (after).
    // getItems always returns an array to simplify your processing.
    let records = getItems(context);

    const knex = context.app.get('knex');

    if (!context.params.top == 'true' && isNaN(context.params.category_id)) {
      let products = await knex
        .raw(
          `SELECT
              COUNT( * ) quantity,
              product_id
          FROM
              orders_details
            INNER JOIN products AS p ON p.id = orders_details.product_id
          WHERE
            p.status = "active"
          AND
            p.deletedAt IS NULL
          AND
            orders_details.deletedAt is NULL
          GROUP BY
              product_id
          ORDER BY
              quantity DESC
              LIMIT ${
                context.params.query.limit ? context.params.query.limit : 10
              }`
        )
        .then((it) => it[0]);

      if (!products.length) {
        products = await context.app
          .service('products')
          .getModel()
          .query()
          .where({ status: 'active', deletedAt: null })
          .orderBy('createdAt', 'desc')
          .limit(context.params.query.limit ? context.params.query.limit : 10)
          .then((it) => it.map((it) => ({ product_id: it.id })));
      }

      context.params.query['id'] = { $in: products.map((it) => it.product_id) };
    }

    if (context.params.top == 'true' && !isNaN(context.params.category_id)) {
      let products = await knex
        .raw(
          `SELECT
          COUNT( * ) quantity,
          product_id,
          DATE_FORMAT( o.createdAt, "%Y-%m-%d:%H" ) AS date,
          c.id 	AS category_id
        FROM
          orders_details as o
          INNER JOIN products AS p ON p.id = o.product_id
          INNER JOIN categories AS c ON c.id = p.category_id
        WHERE c.id = ${context.params.category_id}
        AND p.status = "active"
        AND p.deletedAt IS NOT NULL
        GROUP BY
          product_id
        ORDER BY
          date DESC,
          quantity DESC
          LIMIT ${context.params.query.limit ? context.params.query.limit : 10}`
        )
        .then((it) => it[0]);

      if (!products.length)
        products = await context.app
          .service('products')
          .getModel()
          .query()
          .where({
            category_id: context.params.category_id,
            status: 'active',
            deletedAt: null,
          })
          .orderBy('createdAt', 'desc')
          .limit(context.params.query.limit ? context.params.query.limit : 10)
          .then((it) => it.map((it) => ({ product_id: it.id })));

      context.params.query['id'] = { $in: products.map((it) => it.product_id) };
    }

    // Place the modified records back in the context.
    replaceItems(context, records);
    // Best practice: hooks should always return the context.
    return context;
  };
};

// Throw on unrecoverable error.
// eslint-disable-next-line no-unused-vars
function error(msg) {
  throw new Error(msg);
}
