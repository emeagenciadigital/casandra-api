const { NotAcceptable } = require("@feathersjs/errors")
const { getItems } = require("feathers-hooks-common")
const { longPollingData } = require('./utils')
const { WOMPI_ORDER_STATUS } = require('./constants')

module.exports = async context => {
    const wompi = context.app.get('wompiClient')
    const record = getItems(context)
    const user = context.params.user
    const shipping_address = JSON.parse(record.order.shipping_address_meta_data)

    if (!record.acceptance_token) throw new NotAcceptable('Acceptance token is required!')
    if (!record.bank_code) throw new NotAcceptable('Field bank_code is required!')
    if (typeof record.user_type === 'undefined') throw new NotAcceptable('Field type_user is required!')
    if (!record.user_type_dni) throw new NotAcceptable('Field user_type_dni is required!')
    if (!record.user_dni) throw new NotAcceptable('Field user_dni is required!')

    const payload = {
        amount_in_cents: (record.order.total_price * 100000) / 1000,
        acceptance_token: record.acceptance_token,
        currency: "COP",
        customer_email: user.email,
        payment_method: {
          type: "PSE",
          user_type: record.user_type,
          user_legal_id_type: record.user_type_dni,
          user_legal_id: record.user_dni,
          financial_institution_code: record.bank_code,
          payment_description: `Pago todo en soldaduras ref: ${record.order.id}`,
        },
        redirect_url: record.urlConfirmation,
        reference: `${record.order.id}`,
        customer_data: {
          phone_number: user.phone,
          full_name: `${user.first_name} ${user.last_name}`
        },
        shipping_address: {
          address_line_1: shipping_address.address,
          address_line_2: shipping_address.details,
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


    return {
        order_id: record.order.id,
        status: WOMPI_ORDER_STATUS[payment.status],
        gateway_status: payment.status
    }
}