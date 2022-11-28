const { NotAcceptable } = require("@feathersjs/errors");
const { QueryTypes } = require("sequelize");
const { replaceItems } = require('feathers-hooks-common')

const getUserPurchaseProducts = () => async (context) => {
  const stmt = context.app.get('sequelizeClient')
  const user = context.params.user

  if (!user) throw new NotAcceptable('Required user login')

  const products = await stmt.query(
    `select products.*, products_media.path main_image
    from products
             inner join products_media on products.id = products_media.product_id
        and products_media.deletedAt is null
    where products.id in (select distinct orders_details.product_id
                          from orders_details
                                   inner join orders on orders_details.order_id = orders.id
                              and orders.deletedAt is null
                              and orders.user_id = ${user.id}
                              and orders.order_status_id in (3, 5, 6, 7, 8, 9)
                          where orders_details.deletedAt is null)
      and products.deletedAt is null
      and products.status = 'active'
    group by products.id`,
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
