const { NotAcceptable } = require("@feathersjs/errors")
const { getItems } = require("feathers-hooks-common")
const { Container, when } = require('../../../utils')
const { processOrderPayment, processWalletRecharge } = require("./gateways-methods/wompi.methods")

const AVAILABLE_PAYMENT_METHODS = ['credit_card', 'pse', 'bancolombia', 'nequi', 'wallet']
const AVAILABLE_GATEWAYS = ['wompi']

const validateGatewayAndPaymentMethods = ({ record, ...otherParams }) => {
  if (!record.payment_method) throw new NotAcceptable('Payment method is required.')
  if (!record.gateway) throw new NotAcceptable('Gateway is required')

  const payment_methods = Array.isArray(record.payment_method) ? record.payment_method : [record.payment_method]

  if (payment_methods.some(method => !AVAILABLE_PAYMENT_METHODS.includes(method)))
    throw new NotAcceptable('Some payment methods no are allowed.')

  if (!AVAILABLE_GATEWAYS.includes(record.gateway))
    throw new NotAcceptable('Gateway is not allowed')

  if (payment_methods.length > 2) throw new NotAcceptable('Cannot use more two methods.')

  record.payment_method = payment_methods

  return {
    record,
    ...otherParams
  }
}

const validateTypePayment = ({ record, ...otherParams }) => {
  if (!record.order_id && !record.wallet) throw new NotAcceptable('Type payment not allowed')
  return {
    record,
    ...otherParams
  }
}

const isOrderPayment = ({ record }) => !!record?.order_id
const isWalletRecharge = ({ record }) => !!record?.wallet


module.exports = () => async (context) => {
  const record = getItems(context)
  const user = context.params.user

  return Container.from({ context, record, user })
    .map(validateGatewayAndPaymentMethods)
    .map(validateTypePayment)
    .map(when(isOrderPayment)(processOrderPayment))
    .map(when(isWalletRecharge)(processWalletRecharge))
    .get()
    .then(({ context }) => context)
}