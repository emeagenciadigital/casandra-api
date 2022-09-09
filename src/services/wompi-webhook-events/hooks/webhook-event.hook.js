const { getItems, replaceItems } = require("feathers-hooks-common")
const crypto = require('crypto')
const { Forbidden } = require("@feathersjs/errors")
const { WOMPI_ORDER_STATUS } = require("../../create-process-payment/hooks/gateways-methods/constants")

const updatePayment = async (context, transaction, order) => {
    const wompi = context.app.get('wompiClient')

    const paymentConfirmation = {
        order_id: transaction.reference,
        payment_reference: transaction.id,
        invoice: '',
        description: '',
        value: parseFloat(order.total_price),
        tax: parseFloat(order.total_tax),
        dues: transaction?.payment_method?.installments || 0,
        currency: 'COP',
        bank: transaction.payment_method_type,
        status: transaction.status,
        response: transaction.status,
        gateway: 'wompi',
        date: transaction.created_at,
        type_document: '',
        document: '',
        name: transaction?.payment_method?.extra?.card_holder || '',
        in_tests: wompi.isTest,
        city: transaction.shipping_address.city,
        address: `${transaction.shipping_address.address_line_1} - ${transaction.shipping_address.address_line_2}`,
        payment_method: transaction.payment_method_type
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
            payment_meta_data: JSON.stringify(transaction),
            order_status_id: WOMPI_ORDER_STATUS[transaction.status]
        })
        .where({
            id: order.id
        })

    return {
        success: true,
        message: 'Order updated'
    }
}

module.exports = () => async context => {
    const record = getItems(context)
    const wompi = context.app.get('wompiClient')
    const transaction = record.data.transaction
    const signature = record.signature
    const timestamp = record.timestamp

    const checksum = crypto.createHash('sha256')
        .update(signature.properties.reduce((acc, it) => acc += it.split('.').reduce((acc2, it2) => {
            if (acc2[it2]) acc2 = acc2[it2]
            return acc2
        }, record.data), '') + timestamp + wompi.eventsSecret)
        .digest('hex')

    if (checksum !== signature.checksum) throw new Forbidden('checksum not match')

    const order = await context.app.service('orders')
        .getModel()
        .query()
        .where({
            id: transaction.reference,
            deletedAt: null,
            order_status_id: [1]
        })
        .then(it => it[0])
    
    if (order) return {
        success: false,
        message: 'Order not available!'
    }

    let response = null

    if (record.data.event === 'transaction.updated') {
        response = await updatePayment(context, transaction, order)
    }

    replaceItems(context, response)

    return context
}