const { checkContext, getItems } = require("feathers-hooks-common");
const { conformsTo } = require("lodash");
module.exports = function (options = {}) {
  return async (context) => {
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    const records = getItems(context);

    const { user } = context.params;

    if (user && context.params.distinct == "true") {
      const knex = context.app.get("knex");

      const userProductsViews = await knex
        .raw(
          `SELECT
          max( user_products_views.id ) id,
          user_products_views.product_id,
          user_products_views.createdAt AS last
        FROM
          user_products_views 
        INNER JOIN products ON products.id = user_products_views.product_id
        WHERE 
          user_id = ${user.id}
        AND
          products.deletedAt is null
        GROUP BY
          product_id
        ORDER BY
        user_products_views.id DESC
          LIMIT ${
            context.params.query.$limit ? context.params.query.$limit : 10
          }`
        )
        .then((it) => it[0]);

      context.params.query["id"] = {
        $in: userProductsViews.map((it) => it.id),
      };
    }

    if (!user && context.params.distinct == "true") {
      const knex = context.app.get("knex");
      const userProductsViews = await knex
        .raw(
          `SELECT
            max( user_products_views.id ) id,
            user_products_views.product_id,
            user_products_views.createdAt AS last
          FROM
            user_products_views 
          INNER JOIN products ON products.id = user_products_views.product_id
          WHERE
            off_line_token = "${context.params.query.off_line_token}"
          AND
            products.deletedAt is null
          GROUP BY
            product_id
          ORDER BY
          user_products_views.id DESC
          LIMIT ${
            context.params.query.$limit ? context.params.query.$limit : 10
          }`
        )
        .then((it) => it[0]);

      context.params.query["id"] = {
        $in: userProductsViews.map((it) => it.id),
      };

      context.user = user;
    }

    return context;
  };
};

function error(msg) {
  throw new Error(msg);
}
