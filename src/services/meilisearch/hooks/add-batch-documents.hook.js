const { getItems, replaceItems } = require('feathers-hooks-common')

const addBatchDocuments = () => async (context) => {
  const app = context.app
  const config = app.get('meilisearch')
  const meilisearch = app.get('meilisearchClient')
  const meilisearchIndex = meilisearch.index(config.index)
  const records = getItems(context)

  const response = await meilisearchIndex.addDocuments(Array.isArray(records) ? records : [records])

  replaceItems(context, response)

  return context
}

module.exports = addBatchDocuments
