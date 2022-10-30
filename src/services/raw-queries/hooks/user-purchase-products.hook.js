const { NotAcceptable } = require("@feathersjs/errors");
const { QueryTypes } = require("sequelize");
const { replaceItems } = require('feathers-hooks-common')

const getUserPurchaseProducts = () => async (context) => {
  const stmt = context.app.get('sequelizeClient')
  const user = context.params.user

  if (!user) throw new NotAcceptable('Required user login')

  const products = await stmt.query(
    `select * from products where id in (select distinct orders_details.product_id
      from orders_details
               inner join orders on orders_details.order_id = orders.id
          and orders.deletedAt is null
          and orders.user_id = ${user.id}
          and orders.order_status_id in (3, 5, 6, 7, 8, 9)
      where orders_details.deletedAt is null)
    and deletedAt is null
    and status = 'active'`,
    { type: QueryTypes.SELECT }
  )

  replaceItems(context, products)

  return context
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [getUserPurchaseProducts()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
