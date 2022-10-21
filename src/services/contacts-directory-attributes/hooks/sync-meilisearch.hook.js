const { getItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)

  context.app.service('contacts-directory').patch(record.contact_directory_id, {})

  return context
}