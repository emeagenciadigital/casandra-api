const { getItems } = require('feathers-hooks-common')

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.status === 'inactive') {
    context.app.service('meilisearch').remove(record.id)
    return context
  }

  record.real_id = record.id
  record.id = `directory-${record.id}`
  record.type = 'directory'
  record.category_name = record.category.name

  context.app.service('meilisearch').patch(null, record)

  return context
}