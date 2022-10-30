const { NotAcceptable } = require('@feathersjs/errors')
const { getItems, replaceItems } = require('feathers-hooks-common')

module.exports = () => (context) => {
  const record = getItems(context)
  const user = context.params.user

  if (!user && !record.off_line_token) throw new NotAcceptable('user or offline_token is required.')

  record.user_id = user ? user.id : null
  record.offline_token = record.off_line_token || null

  replaceItems(context, record)

  return context
}