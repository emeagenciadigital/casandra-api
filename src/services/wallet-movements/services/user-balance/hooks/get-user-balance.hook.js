const { GeneralError } = require("@feathersjs/errors")
const { replaceItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = {}

  record.balance = await context.app.service('wallet-movements')
    .getModel()
    .sum('amount_net', { where: { user_id: context.params.user.id } })
    .then(res => res || 0)
    .catch(() => {
      throw new GeneralError('No pudimos hacer esto, por favor intenta nuevamente.')
    })

  replaceItems(context, record)

  return context
}