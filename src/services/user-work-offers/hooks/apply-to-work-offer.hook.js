const { NotAcceptable } = require("@feathersjs/errors")
const { getItems, replaceItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)
  const user = context.params.user

  record.user_id = user.id

  const exists = await context.app.service('user-work-offers')
    .getModel()
    .findOne({
      attributes: ['id'],
      where: { user_id: user.id, work_offer_id: record.work_offer_id }
    })
    .then(res => !!res)

  if (exists) throw new NotAcceptable('Ya has aplicado a esta oferta.')

  replaceItems(context, record)

  return context
}