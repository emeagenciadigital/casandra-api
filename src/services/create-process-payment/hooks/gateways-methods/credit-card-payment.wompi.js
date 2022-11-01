const { GeneralError } = require("@feathersjs/errors")
const { getItems } = require("feathers-hooks-common")
const { longPollingData } = require('./utils')
const { WOMPI_ORDER_STATUS } = require('./constants')

module.exports = async context => {
  const wompi = context.app.get('wompiClient')
  const record = getItems(context)
  const user = context.params.user
  const shipping_address = JSON.parse(record.order.shipping_address_meta_data)

  // if (!record.acceptance_token) throw new NotAcceptable('Acceptance token is required!')

  const acceptanceToken = await wompi.getAcceptanceToken()

  if (!acceptanceToken) throw new GeneralError('No fue posible generar el cobro.')

  console.log(record.creditCard)

  const payload = {
    amount_in_cents: (record.order.total_price * 100000) / 1000,
    acceptance_token: acceptanceToken,
    currency: "COP",
    customer_email: user.email,
    payment_source_id: record.creditCard.credit_card_source_payment_id,
    payment_method: {
      // type: "CARD",
      // token: record.creditCard.credit_card_token_id,
      installments: record.dues,
      payment_description: `Pago Almacén Sandra ref: ${record.order.id}`,
    },
    redirect_url: record.urlConfirmation,
    reference: Buffer.from(JSON.stringify({ order_id: record.order.id, time: new Date().getTime() })).toString('base64'),
    customer_data: {
      phone_number: user.phone,
      full_name: `${user.first_name} ${user.last_name}`
    },
    shipping_address: {
      address_line_1: shipping_address.address,
      //           address_line_2: shipping_address.details,
      country: "CO",
      region: shipping_address.state_name,
      city: shipping_address.city_name,
      name: `${user.first_name} ${user.last_name}`,
      phone_number: user.phone,
    }
  }

  const transaction = await wompi.createTransaction(payload)
  const payment = await longPollingData(
    async () => await wompi.getTransaction(transaction.data.id),
    res => res?.status !== 'PENDING'
  )

  const paymentConfirmation = {
    order_id: record.order.id,
    payment_reference: payment.id,
    invoice: '',
    description: '',
    value: parseFloat(record.order.total_price),
    tax: parseFloat(record.order.total_tax),
    dues: record.dues,
    currency: 'COP',
    bank: payment.payment_method_type,
    status: payment.status,
    response: payment.status,
    gateway: 'wompi',
    date: payment.created_at,
    type_document: '',
    document: '',
    name: payment.payment_method.extra.card_holder,
    in_tests: wompi.isTest,
    city: payment.shipping_address.city,
    address: `${payment.shipping_address.address_line_1} - ${payment.shipping_address.address_line_2}`,
    payment_method: payment.payment_method_type
  }

  const paymentConfirmationCreated = await context.app
    .service('payment-confirmations')
    .create(paymentConfirmation)

  await context.app
    .service('orders')
    .getModel()
    .query()
    .patch({
      payment_confirmation_id: paymentConfirmationCreated.id,
      payment_meta_data: JSON.stringify(payment),
      order_status_id: WOMPI_ORDER_STATUS[payment.status]
    })
    .where({
      id: record.order.id
    })

  return {
    order_id: record.order.id,
    status: WOMPI_ORDER_STATUS[payment.status],
    gateway_status: payment.status
  }
}
