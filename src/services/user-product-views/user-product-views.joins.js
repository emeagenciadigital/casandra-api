const { fastJoin } = require("feathers-hooks-common")

exports.withProductJoin = () => async (context) => {
  if (context.params.userViewProduct !== 'true') return context

  return fastJoin({
    joins: {
      join: () => async (record) => {
        record.product = await context.app.service('products')
          .getModel()
          .query()
          .where({
            id: record.product_id,
            deletedAt: null,
            status: 'active'
          })
          .then(res => res[0])
      }
    }
  })(context)
}