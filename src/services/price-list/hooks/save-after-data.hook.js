const { getItems } = require('feathers-hooks-common')

module.exports = () => async (context) => {
  const { prices, customer_groups } = context.data
  const record = getItems(context)

  const pricesModel = context.app.service('price-list-prices').getModel()
  const groupsModel = context.app.service('price-list-customer-groups').getModel()

  await Promise.all([
    prices?.length && pricesModel.bulkCreate(
      prices.map(
        (price) => ({ ...price, price_list_id: record.id })
      ),
    ),
    customer_groups?.length && groupsModel.bulkCreate(
      customer_groups.map(
        (group) => ({ ...group, price_list_id: record.id })
      )
    )
  ])


  return context
}