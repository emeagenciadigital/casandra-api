const { NotAcceptable } = require("@feathersjs/errors")

module.exports = () => async (context) => {
  if (context.params.userViewProduct !== 'true') return context

  const query = context.params.query || {}
  const user = context.params.user

  if (!user && !query.off_line_token) throw new NotAcceptable('User of off_line_token is required.')

  const productViews = await context.app.service('user-product-views')
    .getModel()
    .findAll({
      attributes: ['product_id', 'id'],
      where: {
        user_id: user ? user.id : null,
        off_line_token: query.off_line_token || null
      },
      group: ['product_id']
    })

  const productIds = await context.app
    .service('products')
    .getModel()
    .query()
    .select('id')
    .whereIn('id', productViews.map(it => it.product_id))
    .where({ status: 'active', deletedAt: null })
    .then(res => res.map(it => it.id))

  const viewIds = productViews
    .filter(it => productIds.includes(it.product_id))
    .map(it => it.id)

  context.params.query = { id: { $in: viewIds }, $sort: { id: -1 } }

  return context
}