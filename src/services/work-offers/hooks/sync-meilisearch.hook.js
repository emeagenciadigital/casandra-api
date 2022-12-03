const { getItems } = require('feathers-hooks-common')

const withAllData = (record) => async (context) => {
  [record.city, record.category] = await Promise.all([
    context.app.service('locations-cities')
      .getModel()
      .findByPk(record.city_id),
    context.app.service('work-offers-categories')
      .getModel()
      .findByPk(record.category_id)
  ])

  return record
}

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.status === 'inactive' || context.method === 'remove') {
    context.app.service('meilisearch').remove(null, { query: { index: 'work-offers', records: record.id } })
    return context
  }

  context.app.service('meilisearch').patch(null, {
    index: 'work-offers',
    records: await withAllData(record)(context)
  })

  return context
}