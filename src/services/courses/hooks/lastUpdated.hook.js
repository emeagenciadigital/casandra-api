const { getItems, replaceItems } = require("feathers-hooks-common")

module.exports = () => context => {
  const record = getItems(context)

  record.content_last_updated = new Date().toISOString()

  replaceItems(context, record)

  return context
}