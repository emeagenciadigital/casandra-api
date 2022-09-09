// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { QueryTypes } = require('sequelize');
// eslint-disable-next-line no-unused-vars

const connectEAD = (app) => {
  const { client, connection } = app.get("oracle-ead");
  // oracledb.initOracleClient({ libDir: path.join(__dirname, './lib/includes/instantclient_21_5') })
  const knex = require("knex")({ client, connection });
  knex.on("query", (data) => {
    console.log(data.sql);
  });
  return knex;
}


module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    let query = {};
    if (!user) {
      query = {
        id: records.shopping_cart_id,
        deletedAt: null,
        status: "active",
      };
    } else {
      query = {
        user_id: user.id,
        deletedAt: null,
        status: "active",
      };
    }

    const shoppingCar = await context.app
      .service("shopping-cart")
      .getModel()
      .query()
      .where({ ...query })
      .orderBy("createdAt", "desc")
      .then((it) => it[0]);

    const [shoppingCartDetails, product] = await Promise.all([
      context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .where({
          shopping_cart_id: shoppingCar.id,
          deletedAt: null,
          product_id: records.product_id,
        })
        .then((it) => it[0]),
      context.app
        .service("products")
        .getModel()
        .query()
        .where({ id: records.product_id, deletedAt: null, status: "active" })
        .then((it) => it[0]),
    ]);

    if (!product) throw new NotAcceptable("No se encontró el producto.");

    if (product.integration_id) {
      const erpSequelize = context.app.get('sequelizeClient')
      const erpEAD = connectEAD(context.app)

      const [pERP, pEAD] = await Promise.all([
        !product.is_ead ? erpSequelize.query(`
        SELECT
          am_CAN_ARTI AS quantity
        FROM
          db_vw_SUP_ART_SALD_WEB
        WHERE
          cd_ART_CODI = '${product.integration_id}'
      `, { type: QueryTypes.SELECT })
        .then(res => res && res[0]) : undefined,
        product.is_ead ? erpEAD.raw(`
        SELECT
          cantidad as quantity
        FROM
          JAMAR.vista_articulos_ecomerce
        WHERE
          codigo = '${product.integration_id}'
      `).then(res => res && res[0]) : undefined
      ])

      // close connections
      erpEAD.destroy()

      if (pEAD) {
        if (Number(`${pEAD['QUANTITY']}`) < records.quantity)  throw new NotAcceptable(
          "La cantidad supera el stock actual de este producto."
        );
      } else {
        if (Number(`${pERP['quantity']}`) < records.quantity)  throw new NotAcceptable(
          "La cantidad supera el stock actual de este producto."
        );
      }
    } else if (product.quantity < records.quantity) {
      throw new NotAcceptable(
        "La cantidad supera el stock actual de este producto."
      );
    }
      
    if (shoppingCartDetails) {
      await context.app
        .service("shopping-cart-details")
        .getModel()
        .query()
        .where({
          product_id: records.product_id,
          shopping_cart_id: shoppingCar.id,
        })
        .increment("quantity", records.quantity);

      context.result = [
        {
          product_id: records.product_id,
          quantity: records.quantity + shoppingCartDetails.quantity,
          shopping_cart_id: shoppingCar.id,
        },
      ];
    }

    replaceItems(context, records);

    return context;
  };
};
