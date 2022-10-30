const { getItems, replaceItems } = require("feathers-hooks-common")

module.exports = () => (context) => {
  const user = context.params.user
  const record = getItems(context)

  record.created_by_user_id = user.id
  replaceItems(context, record)

  return context
}