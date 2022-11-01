const { NotAcceptable, NotAuthenticated, NotFound, Forbidden } = require("@feathersjs/errors")
const { getItems, replaceItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)
  const user = context.params.user

  if (!user) throw new NotAuthenticated('Require user login.')
  else if (!record.credit_card_id) throw new NotAcceptable('credit_card_id is required.')
  else if (!record.verification_amount) throw new NotAcceptable('verification_amount is required.')

  const creditCard = await context.app.service('credit-cards')
    .getModel()
    .query()
    .where({
      id: record.credit_card_id,
      deletedAt: null
    })
    .then(res => res[0])

  if (!creditCard) throw new NotFound('No se encontró la tarjeta de crédito.')
  else if (creditCard.user_id !== user.id) throw new Forbidden('No puedes usar está tarjeta de crédito.')
  else if (creditCard.verified_status === 'verified') throw new NotAcceptable('Esta tarjeta ya está verificada.')
  else if (creditCard.verified_status === 'blocked') throw new NotAcceptable('Superaste el límite de intentos.')

  const wompi = context.app.get('wompiClient')

  if (creditCard.verification_amount !== record.verification_amount) {
    const attempts = creditCard.verification_attempts - 1

    await context.app.service('credit-cards')
      .getModel()
      .query()
      .patch({
        verification_attempts: attempts,
        verified_status: attempts === 0 ? 'blocked' : 'pending'
      })
      .where({
        id: creditCard.id
      })

    if (attempts === 0) {
      wompi.voidTransaction(creditCard.gateway_verification_ref, (creditCard.verification_amount * 100000) / 1000)
    }

    throw new NotAcceptable('El monto ingresado es inválido.')
  } else {
    await context.app.service('credit-cards')
      .getModel()
      .query()
      .patch({
        verified_status: 'verified'
      })
      .where({
        id: creditCard.id
      })


    wompi.voidTransaction(creditCard.gateway_verification_ref, (creditCard.verification_amount * 100000) / 1000)

    replaceItems(context, { success: true })
  }


  return context
}