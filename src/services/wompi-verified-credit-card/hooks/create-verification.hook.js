const { NotAcceptable, NotFound, Forbidden, GeneralError } = require("@feathersjs/errors")
const { getItems, replaceItems } = require("feathers-hooks-common")
const { longPollingData } = require('../../../utils')

module.exports = () => async (context) => {
  const record = getItems(context)
  const user = context.params.user

  if (!record.credit_card_id) throw new NotAcceptable('credit_card_id is required.')
  if (!user) throw NotAcceptable('Require user login.')

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
  else if (creditCard.verified_status === 'started') throw new NotAcceptable('Ya tienes un proceso de verificación con esta tarjeta.')


  const min = 1500
  const max = 2000
  const amount = Math.floor(Math.random() * (max - min + 1) + min)

  const wompi = context.app.get('wompiClient')

  const acceptanceToken = await wompi.createMerchant()
    .then(res => res.data.presigned_acceptance.acceptance_token)
    .catch(() => undefined)

  if (!acceptanceToken) throw new GeneralError('No fue posible generar el cobro.')

  const payload = {
    amount_in_cents: (amount * 100000) / 1000,
    acceptance_token: acceptanceToken,
    currency: 'COP',
    customer_email: user.email,
    payment_method: {
      // type: 'CARD',
      // token: creditCard.credit_card_token_id,
      installments: 1,
      payment_description: 'Verificación Almacén Sandra'
    },
    reference: `tc-verification-${creditCard.id}-${new Date().getTime()}`,
    payment_source_id: creditCard.credit_card_source_payment_id,
  }

  const transaction = await wompi.createTransaction(payload)
  const payment = await longPollingData(
    async () => await wompi.getTransaction(transaction.data.id),
    res => res?.status !== 'PENDING',
  )

  if (payment.status !== 'APPROVED') throw new NotAcceptable('No fue posible generar el cobro.')

  await context.app.service('credit-cards')
    .getModel()
    .query()
    .patch({
      gateway_verification_ref: payment.id,
      verified_status: 'started',
      verification_amount: amount,
    })
    .where({
      id: creditCard.id
    })

  replaceItems(context, {
    success: true,
    credit_card_id: creditCard.id,
    attempts: creditCard.verification_attempts
  })

  return context
}