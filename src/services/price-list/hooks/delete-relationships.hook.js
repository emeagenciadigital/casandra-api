const { getItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)

  await Promise.all([
    context.app.service('price-list-prices')
      .getModel()
      .destroy({
        where: { price_list_id: record.id }
      }),
    context.app.service('price-list-customer-groups')
      .getModel()
      .destroy({
        where: { price_list_id: record.id }
      })
  ])

  return context
}