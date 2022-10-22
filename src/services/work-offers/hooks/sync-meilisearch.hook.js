const { getItems } = require('feathers-hooks-common')

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.status === 'inactive' || context.method === 'remove') {
    context.app.service('meilisearch').remove(`work-offer-${record.id}`)
    return context
  }

  context.app.service('meilisearch').patch(null, {
    ...record,
    id: `work-offer-${record.id}`,
    real_id: record.id,
    type: 'work-offer',
  })

  return context
}