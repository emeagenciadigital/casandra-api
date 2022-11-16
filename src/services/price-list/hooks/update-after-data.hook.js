const { getItems } = require('feathers-hooks-common')
const { Op } = require('sequelize')

module.exports = () => async (context) => {
  const { prices, customer_groups } = context.data
  const record = getItems(context)

  const pricesModel = context.app.service('price-list-prices').getModel()
  const groupsModel = context.app.service('price-list-customer-groups').getModel()

  await Promise.all([
    prices?.length && pricesModel.destroy({
      where: {
        price_list_id: record.id,
        id: {
          [Op.notIn]: prices.filter(it => !!it?.id).map(it => it.id)
        }
      }
    }),
    groupsModel?.length && groupsModel.destroy({
      where: {
        price_list_id: record.id,
        id: {
          [Op.notIn]: customer_groups.filter(it => !!it?.id).map(it => it.id)
        }
      }
    })
  ])

  const createPrices = (prices || [])
    .filter(it => !it?.id)
    .map(it => ({ ...it, price_list_id: record.id }))

  const createGroups = (customer_groups || [])
    .filter(it => !it?.id)
    .map(it => ({ ...it, price_list_id: record.id }))

  const updatePrices = (prices || [])
    .filter(it => !!it?.id)

  const updateGroups = (customer_groups || [])
    .filter(it => !!it?.id)

  await Promise.all([
    createPrices.length && pricesModel.bulkCreate(
      createPrices
    ),
    createGroups.length && groupsModel.bulkCreate(
      createGroups
    ),
    updatePrices.length && pricesModel.bulkCreate(
      updatePrices,
      {
        updateOnDuplicate: ['price', 'product_id']
      }
    ),
    updateGroups.length && groupsModel.bulkCreate(
      updateGroups,
      {
        updateOnDuplicate: ['customer_group_id']
      }
    )
  ])


  return context
}