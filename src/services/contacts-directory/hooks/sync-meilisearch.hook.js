const { getItems } = require('feathers-hooks-common')

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.status === 'inactive' || context.method === 'remove') {
    context.app.service('meilisearch').remove(`directory-${record.id}`)
    return context
  }

  context.app.service('meilisearch').patch(null, {
    ...record,
    id: `directory-${record.id}`,
    real_id: record.id,
    type: 'directory',
    category_name: record.category.name,
  })

  return context
}