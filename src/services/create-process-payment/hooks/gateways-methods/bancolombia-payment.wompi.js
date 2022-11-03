const { GeneralError } = require("@feathersjs/errors")
const { getItems } = require("feathers-hooks-common")
const { longPollingData } = require('./utils')
const { WOMPI_ORDER_STATUS } = require('./constants')
const { GatewayTypes, UserTransactionType } = require("../../../../models/user-gateway-transactions.model")

module.exports = async context => {
  const wompi = context.app.get('wompiClient')
  const record = getItems(context)
  const user = context.params.user
  const shipping_address = JSON.parse(record.order.shipping_address_meta_data)

  // if (!record.acceptance_token) throw new NotAcceptable('Acceptance token is required!')

  const acceptanceToken = await wompi.getAcceptanceToken()

  if (!acceptanceToken) throw new GeneralError('No fue posible generar el cobro.')

  const payload = {
    amount_in_cents: (record.order.total_price * 100000) / 1000,
    acceptance_token: acceptanceToken,
    currency: "COP",
    customer_email: user.email,
    payment_method: {
      type: "BANCOLOMBIA_TRANSFER",
      user_type: "PERSON",
      payment_description: `Pago Almacén Sandra ref: ${record.order.id}`,
      // ecommerce_url: '',
      ...(process.env.NODE_ENV !== 'production' ? { sandbox_status: 'APPROVED' } : {})
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

  context.app.service('user-gateway-transactions')
    .getModel()
    .create({
      user_id: user.id,
      gateway: GatewayTypes.WOMPI,
      amount: record.order.total_price,
      type: UserTransactionType.PAYMENT,
      gateway_reference: transaction.data.id,
    })

  const payment = await longPollingData(
    async () => await wompi.getTransaction(transaction.data.id),
    res => res?.payment_method?.extra?.async_payment_url
  )

  const paymentConfirmation = {
    order_id: record.order.id,
    payment_reference: payment.id,
    invoice: '',
    description: '',
    value: parseFloat(record.order.total_price),
    tax: parseFloat(record.order.total_tax),
    dues: 0,
    currency: 'COP',
    bank: payment.payment_method_type,
    status: payment.status,
    response: payment.status,
    gateway: 'wompi',
    date: payment.created_at,
    type_document: record.user_type_dni,
    document: record.user_dni,
    name: '',
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
      id: record.order.id,
    })

  await context.app
    .service('order-history')
    .getModel()
    .query()
    .insert({
      order_id: record.order.id,
      order_status_id: WOMPI_ORDER_STATUS[payment.status],
      user_id: user.id
    })


  return {
    order_id: record.order.id,
    status: WOMPI_ORDER_STATUS[payment.status],
    gateway_status: payment.status,
    url_payment: payment.payment_method.extra.async_payment_url
  }
}
