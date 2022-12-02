const { NotFound, NotAcceptable, GeneralError } = require("@feathersjs/errors")
const { replaceItems } = require("feathers-hooks-common")
const { GatewayTypes, UserTransactionType, TransactionStatus } = require("../../../../models/user-gateway-transactions.model")
const { Container, when, longPollingData } = require("../../../../utils")
// const { WOMPI_ORDER_STATUS } = require("./constants")

const STATUS_PENDING_PAYMENT = 1
const ID_URL_CONFIRMATION = 1

const gatewayMethodIs = (method) => ({ record }) => record.payment_method.includes(method)
const isPendingPayment = ({ order }) => order.amount_paid_from_wallet < order.total_price
const orderIsPaymentFromWallet = ({ order }) => order.amount_paid_from_wallet >= order.total_price
const paymentIsApproved = ({ payment }) => payment.status === 'APPROVED'
// eslint-disable-next-line no-unused-vars
const paymentIsRejected = (({ payment }) => payment && payment.status !== 'APPROVED' && payment.status !== 'PENDING')

const getOrderData = ({ context, user, record, ...otherParams }) => {

  const order = context.app.service('orders')
    .getModel()
    .query()
    .where({
      id: record.order_id,
      user_id: user.id,
      order_status_id: STATUS_PENDING_PAYMENT,
      deletedAt: null
    }).then(it => it[0])
    .then(it => {
      if (!it) throw new NotFound('Order not found.')

      return it
    })



  return {
    context,
    order,
    user,
    record,
    ...otherParams
  }
}

const getUrlConfirmation = ({ context, record, ...otherParams }) => {
  const urlConfirmation = context.app.service('configurations')
    .getModel()
    .query()
    .where({
      id: ID_URL_CONFIRMATION
    })
    .then(it => it[0]?.value)
    .then(urlConfirmation => `${urlConfirmation}/${record.order_id}`)

  return {
    context,
    record,
    urlConfirmation,
    ...otherParams
  }

}

const getCreditCard = ({ context, record, user, ...otherParams }) => {
  if (!record.credit_card_id) throw new NotAcceptable('credit_card_id is required.')

  const creditCard = context.app.service('credit-cards')
    .getModel()
    .query()
    .where({
      id: record.credit_card_id,
      user_id: user.id,
      deletedAt: null
    })
    .then(it => it[0])
    .then(it => {
      if (!it) throw new NotAcceptable('Credit card no found.')
      else if (it.verified_status !== 'verified') throw new NotAcceptable('La tarjeta de crédito no ha sido verificada.')
      else if (record.gateway !== it.gateway) throw new NotAcceptable('Invalid credit card!')
      return it
    })

  return {
    context,
    record,
    user,
    creditCard,
    ...otherParams
  }
}

const getAcceptanceToken = async ({ context, gatewayPayload, ...otherParams }) => {
  const wompi = context.app.get('wompiClient')
  const acceptanceToken = await wompi.getAcceptanceToken()

  if (!acceptanceToken) throw new GeneralError('No fue posible generar el cobro.')

  gatewayPayload.acceptance_token = acceptanceToken

  return {
    context,
    gatewayPayload,
    ...otherParams
  }
}

const getGatewayPayload = (type) => ({
  order,
  user,
  record,
  creditCard,
  urlConfirmation,
  ...otherParams
}) => {
  if (type === 'recharge' && !record.amount) throw new NotAcceptable('Amount is required')

  const shipping_address = type === 'payment' ? JSON.parse(order.shipping_address_meta_data) : {}

  const amount = type === 'payment' ? order.total_price - order.amount_paid_from_wallet : record.amount

  const payload = {
    amount_in_cents: (amount * 100000) / 1000,
    currency: "COP",
    customer_email: user.email,
    ...(record.payment_method.includes('credit_card')
      ? { payment_source_id: creditCard.credit_card_source_payment_id }
      : {}),
    payment_method: {
      ...(record.payment_method.includes('pse')
        ? {
          type: "PSE",
          user_type: record.user_type,
          user_legal_id_type: record.user_type_dni,
          user_legal_id: record.user_dni,
          financial_institution_code: record.bank_code,
        }
        : {}),
      ...(record.payment_method.includes('credit_card')
        ? {
          installments: record.dues
        }
        : {}),
      ...(record.payment_method.includes('nequi')
        ? {
          type: "NEQUI",
          phone_number: record.phone_number,
        }
        : {}),
      ...(record.payment_method.includes('bancolombia')
        ? {
          type: "BANCOLOMBIA_TRANSFER",
          user_type: "PERSON",
          ...(process.env.NODE_ENV !== 'production' ? { sandbox_status: 'APPROVED' } : {})
        }
        : {}),
      payment_description: type === 'payment' ? `Pago Almacén Sandra ref: ${order.id}` : 'Recarga wallet Almacén Sandra',
    },
    redirect_url: urlConfirmation,
    reference: Buffer.from(JSON.stringify({ ...(type === 'payment' ? { order_id: order.id } : { user_id: user.id }), time: new Date().getTime() })).toString('base64'),
    customer_data: {
      phone_number: user.phone,
      full_name: `${user.first_name} ${user.last_name}`
    },
    ...(type === 'payment' ? {
      shipping_address: {
        address_line_1: shipping_address.address,
        country: "CO",
        region: shipping_address.state_name,
        city: shipping_address.city_name,
        name: `${user.first_name} ${user.last_name}`,
        phone_number: user.phone,
      }
    } : {})
  }

  return {
    order,
    user,
    record,
    creditCard,
    urlConfirmation,
    gatewayPayload: payload,
    ...otherParams
  }
}

const payOrderFromWallet = async ({ context, user, order, ...otherParams }) => {
  const balance = await context.app.service('wallet-movements')
    .getModel()
    .sum('amount_net', { where: { user_id: user.id } })
    .then(res => res || 0)
    .catch(() => {
      throw new GeneralError('No pudimos hacer esto, por favor intenta nuevamente.')
    })

  let walletAmount = 0
  if (balance > 0) {
    if (balance <= order.total_price) walletAmount = balance
    else walletAmount = order.total_price
  }

  if (walletAmount) {
    order.amount_paid_from_wallet = walletAmount
    order.amount_paid_from_gateway = order.total_price - walletAmount
    // order.order_status_id = walletAmount === order.total_price ? 3 : 1

    const walletMovement = await context.app.service('wallet-movements')
      .getModel()
      .create({
        user_id: user.id,
        type: 'payment',
        amount_net: -walletAmount,
        description: `Pago de compra ${order.id}`,
        payment_id: order.id,
        created_by_user_id: user.id,
      })

    await context.app.service('orders')
      .getModel()
      .query()
      .patch({
        amount_paid_from_wallet: order.amount_paid_from_wallet,
        amount_paid_from_gateway: order.amount_paid_from_gateway,
        // order_status_id: order.order_status_id,
      })
      .where({ id: order.id })

    return {
      context,
      user,
      order,
      walletMovement,
      ...otherParams
    }

  }

  return {
    context,
    user,
    order,
    ...otherParams
  }
}

const saveOrderPaymentAndConfirm = async ({
  context,
  order,
  walletMovement,
  user,
  ...otherParams
}) => {

  const paymentConfirmation = await context.app.service('payment-confirmations')
    .create({
      order_id: order.id,
      payment_reference: `wallet-${walletMovement.id}`,
      invoice: '',
      description: '',
      value: order.total_price,
      tax: order.total_tax,
      dues: 0,
      currency: 'COP',
      bank: 'wallet',
      status: 'APPROVED',
      gateway: 'wallet',
      date: new Date().toISOString(),
    })

  const processPaymentData = {
    order_id: order.id,
    type: 'orders',
    response_code: 'approved',
    payment_info: paymentConfirmation
  }

  await Promise.all([
    context.app.service('process-payment-response').create(processPaymentData),
    context.app
      .service('orders')
      .getModel()
      .query()
      .patch({
        payment_confirmation_id: paymentConfirmation.id,
        payment_meta_data: JSON.stringify(paymentConfirmation),
      })
      .where({
        id: order.id
      }),
  ])

  return {
    context,
    order,
    walletMovement,
    user,
    ...otherParams
  }
}

const validateMethodBody = ({ record, ...otherParams }) => {
  const REQUIRED_FIELDS_METHOD = {
    pse: ['bank_code', 'user_type', 'user_type_dni', 'user_dni'],
    credit_card: [],
    nequi: ['phone_number'],
    bancolombia: []
  }

  const gatewayMethod = record.payment_method.filter(it => it !== 'wallet')
  if (gatewayMethod.length > 1) throw new NotAcceptable('Cannot use more one gateway method.')

  const recordKeys = Object.keys(record)

  if (
    REQUIRED_FIELDS_METHOD[gatewayMethod[0]].length &&
    REQUIRED_FIELDS_METHOD[gatewayMethod[0]].some(it => !recordKeys.includes(it))
  ) throw new NotAcceptable('Body no match.')

  return {
    record,
    gatewayMethod: gatewayMethod[0],
    ...otherParams,
  }
}

const createGatewayPayment = (type) => async ({
  context,
  gatewayPayload,
  user,
  order,
  gatewayMethod,
  record,
  ...otherParams
}) => {
  const wompi = context.app.get('wompiClient')

  const transaction = await wompi.createTransaction(gatewayPayload)

  let payment = null

  const NO_REQUIRED_LONG_POLLING_METHODS = ['credit_card', 'nequi']
  if (!record.payment_method.some(method => NO_REQUIRED_LONG_POLLING_METHODS.includes(method))) {
    payment = await longPollingData(
      async () => await wompi.getTransaction(transaction.data.id),
      res => {
        return !!res?.payment_method?.extra?.async_payment_url
      }
    )
  } else {
    payment = transaction.data
  }


  const userGatewayTransaction = await context.app.service('user-gateway-transactions')
    .getModel()
    .create({
      user_id: user.id,
      gateway: GatewayTypes.WOMPI,
      amount: type === 'payment' ? order.total_price - order.amount_paid_from_wallet : record.amount,
      type: type === 'payment' ? UserTransactionType.PAYMENT : UserTransactionType.WALLET_RECHARGE,
      gateway_reference: payment.id,
      status: TransactionStatus.PENDING,
      gateway_status: payment.status,
    })


  const paymentConfirmationCreated = await context.app
    .service('payment-confirmations')
    .create({
      ...(type === 'payment' ? { order_id: order.id } : { user_gateway_transaction_id: userGatewayTransaction.id }),
      user_id: user.id,
      payment_reference: payment.id,
      invoice: '',
      description: '',
      value: type === 'payment' ? parseFloat(order.total_price - order.amount_paid_from_wallet) : record.amount,
      tax: type === 'payment' ? parseFloat(order.total_tax) : 0,
      dues: 0,
      currency: 'COP',
      bank: payment.payment_method_type,
      status: payment.status,
      response: payment.status,
      gateway: 'wompi',
      date: payment.created_at,
      in_tests: wompi.isTest,
      city: payment?.shipping_address?.city || '',
      address: `${payment?.shipping_address?.address_line_1} - ${payment.shipping_address?.address_line_2}`,
      payment_method: payment.payment_method_type
    })

  if (type === 'payment') {
    await context.app
      .service('orders')
      .getModel()
      .query()
      .patch({
        payment_confirmation_id: paymentConfirmationCreated.id,
        payment_meta_data: JSON.stringify(payment),
        // order_status_id: WOMPI_ORDER_STATUS[payment.status]
      })
      .where({
        id: order.id,
      })
  }

  return {
    context,
    gatewayPayload,
    user,
    order,
    gatewayMethod,
    userGatewayTransaction,
    payment,
    record,
    ...otherParams
  }
}

const payOrderFromGatewayMethod = async (args) => {
  return Container.from(args)
    .map(validateMethodBody)
    .map(getGatewayPayload('payment'))
    .map(getAcceptanceToken)
    .get()
    .then(createGatewayPayment('payment'))
    .then(({ context, ...otherParams }) => {
      return {
        context,
        ...otherParams,
      }
    })
}

const createUserWalletMovement = async ({
  context,
  user,
  payment,
  userGatewayTransaction,
  ...restParams
}) => {
  const wompi = context.app.get('wompiClient')
  const paymentConfirmation = {
    user_id: user.id,
    payment_reference: payment.id,
    invoice: '',
    description: '',
    value: userGatewayTransaction.amount,
    tax: 0,
    dues: payment?.payment_method?.installments || 0,
    currency: 'COP',
    bank: payment.payment_method_type,
    status: payment.status,
    response: payment.status,
    gateway: 'wompi',
    date: payment.created_at,
    type_document: '',
    document: '',
    name: payment?.payment_method?.extra?.card_holder || '',
    in_tests: wompi.isTest,
    city: payment?.shipping_address?.city || '',
    address: `${payment.shipping_address?.address_line_1} - ${payment.shipping_address?.address_line_2}`,
    payment_method: payment.payment_method_type
  }

  const paymentConfirmationCreated = await context.app
    .service('payment-confirmations')
    .create(paymentConfirmation)

  if (payment.status === 'APPROVED') {
    await context.app
      .service('wallet-movements')
      .getModel()
      .create({
        user_id: user.id,
        type: 'recharge',
        amount_net: userGatewayTransaction.amount,
        description: `Recarga wallet`,
        payment_id: paymentConfirmationCreated.id,
        created_by_user_id: user.id,
      })
  }

  return {
    context,
    user,
    payment,
    userGatewayTransaction,
    ...restParams
  }
}

const rechargeOrderFormGatewayMethod = async (args) => {
  return Container.from(args)
    .map(validateMethodBody)
    .map(getGatewayPayload('recharge'))
    .map(getAcceptanceToken)
    .get()
    .then(createGatewayPayment('recharge'))
  // .then(when(paymentIsApproved)(createUserWalletMovement))
}

const getAsyncRequests = async ({ order, urlConfirmation, creditCard, ...otherParams }) => {

  return {
    order: await order,
    urlConfirmation: await urlConfirmation,
    creditCard: creditCard ? await creditCard : null,
    ...otherParams,
  }
}

// eslint-disable-next-line no-unused-vars
const returnUserAmountWallet = async ({
  context,
  order,
  user,
  ...otherParams
}) => {

  if (!order.amount_paid_from_wallet)
    return {
      context,
      ...otherParams,
    }

  await context.app.service('wallet-movements')
    .getModel()
    .create({
      user_id: user.id,
      type: 'payment',
      amount_net: order.amount_paid_from_wallet,
      description: `Reembolso de compra ${order.id}`,
      payment_id: order.id,
      created_by_user_id: user.id,
    })

  return {
    context,
    order,
    user,
    ...otherParams
  }
}

const processOrderPayment = (args) => {
  return Container.from(args)
    .map(getOrderData)
    .map(getUrlConfirmation)
    .map(when(gatewayMethodIs('credit_card'))(getCreditCard))
    .map(getAsyncRequests)
    .get()
    .then(when(gatewayMethodIs('wallet'))(payOrderFromWallet))
    .then(when(orderIsPaymentFromWallet)(saveOrderPaymentAndConfirm))
    .then(when(isPendingPayment)(payOrderFromGatewayMethod))
    // .then(when(paymentIsRejected)(returnUserAmountWallet))
    .then(({ context, order, payment, userGatewayTransaction, ...otherParams }) => {

      replaceItems(context, {
        order_id: order.id,
        status: order.order_status_id,
        ...(payment
          ? {
            gateway_status: payment.status,
            url_payment: payment.payment_method?.extra?.async_payment_url,
            user_gateway_transaction_id: userGatewayTransaction.id,
          }
          : {}
        )
      })

      return {
        context,
        order,
        ...otherParams
      }
    })
}

const processWalletRecharge = (args) => {
  return Container.from(args)
    .map(getUrlConfirmation)
    .map(when(gatewayMethodIs('credit_card'))(getCreditCard))
    .map(getAsyncRequests)
    .get()
    .then(rechargeOrderFormGatewayMethod)
    .then(({ context, payment, userGatewayTransaction, ...otherParams }) => {
      replaceItems(context, {
        status: payment.status,
        ...(payment
          ? {
            gateway_status: payment.status,
            url_payment: payment.payment_method?.extra?.async_payment_url,
            user_gateway_transaction_id: userGatewayTransaction.id
          }
          : {}
        )
      })

      return {
        context,
        payment,
        ...otherParams
      }
    })
}

module.exports = {
  processOrderPayment,
  processWalletRecharge
}