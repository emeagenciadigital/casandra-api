
const { replaceItems } = require('feathers-hooks-common')

const deleteBatchDocuments = () => async (context) => {
  const app = context.app
  const config = app.get('meilisearch')
  const meilisearch = app.get('meilisearchClient')
  const meilisearchIndex = meilisearch.index(config.index)
  const records = context.id

  const response = await meilisearchIndex.deleteDocuments(Array.isArray(records) ? records : [records])

  replaceItems(context, response)

  return context
}

module.exports = deleteBatchDocuments
