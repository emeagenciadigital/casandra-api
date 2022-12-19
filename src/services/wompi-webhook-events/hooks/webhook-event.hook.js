const { getItems, replaceItems } = require("feathers-hooks-common")
const crypto = require('crypto')
const { Forbidden, NotFound } = require("@feathersjs/errors")
// const { WOMPI_ORDER_STATUS } = require("../../create-process-payment/hooks/gateways-methods/constants")
const { UserTransactionType, TransactionStatus } = require("../../../models/user-gateway-transactions.model")

const processPaymentOrder = () => async (context) => {
    const wompi = context.app.get('wompiClient')
    const record = getItems(context)
    const transaction = record.data.transaction

    const STATUS = {
        PENDING: 'pending',
        APPROVED: 'approved',
        DECLINED: 'failure',
        VOIDED: 'cancelled',
        ERROR: 'failure',
    }

    const orderId = JSON.parse(Buffer.from(transaction.reference, 'base64').toString('ascii')).order_id

    const order = await context.app.service('orders')
        .getModel()
        .query()
        .where({
            id: orderId,
            deletedAt: null,
            order_status_id: 1
        })
        .then(it => it[0])

    if (!order) {
        await context.app
            .service('user-gateway-transactions')
            .getModel()
            .update(
                {
                    status: TransactionStatus.PROCESSED,
                    gateway_status: 'FAILED'
                },
                {
                    where: { gateway_reference: transaction.id }
                }
            )

        replaceItems(context, {
            success: false,
            message: 'Order not found.'
        })
        return context
    }

    const processPaymentData = {
        order_id: order.id,
        response_code: STATUS[transaction.status],
        payment_info: transaction,
        type: 'orders',
    }


    const paymentConfirmation = {
        order_id: orderId,
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

    const [paymentConfirmationCreated] = await Promise.all([
        context.app
            .service('payment-confirmations')
            .create(paymentConfirmation),
        context.app.service('process-payment-response').create(processPaymentData)
    ])

    await context.app
        .service('orders')
        .getModel()
        .query()
        .patch({
            payment_confirmation_id: paymentConfirmationCreated.id,
            payment_meta_data: JSON.stringify(transaction),
            // order_status_id: WOMPI_ORDER_STATUS[transaction.status]
        })
        .where({
            id: order.id
        })

    // await context.app
    //     .service('order-history')
    //     .getModel()
    //     .query()
    //     .insert({
    //         order_id: order.id,
    //         order_status_id: WOMPI_ORDER_STATUS[transaction.status],
    //     })

    if (order.amount_paid_from_wallet && ['DECLINED', 'VOIDED', 'ERROR'].includes(transaction.status)) {
        const returnExist = await context.app
            .service('wallet-movements')
            .getModel()
            .findOne({
                attributes: ['id'],
                where: {
                    user_id: order.user_id,
                    type: 'return',
                    payment_id: order.id,
                    amount_net: order.amount_paid_from_wallet,
                    // description: `Reembolso de compra ${order.id}`
                }
            })
        if (!returnExist) {
            await context.app
                .service('wallet-movements')
                .getModel()
                .create({
                    user_id: order.user_id,
                    type: 'return',
                    amount_net: order.amount_paid_from_wallet,
                    description: `Reembolso de compra ${order.id}`,
                    payment_id: order.id,
                    created_by_user_id: order.user_id,
                })
        }
    }

    await context.app
        .service('user-gateway-transactions')
        .getModel()
        .update(
            { status: TransactionStatus.PROCESSED, gateway_status: transaction.status },
            { where: { gateway_reference: transaction.id } }
        )


    replaceItems(context, {
        success: true,
        message: 'Order updated'
    })

    return context
}

const processPaymentRecharge = () => async (context) => {
    const wompi = context.app.get('wompiClient')
    const record = getItems(context)
    const transaction = record.data.transaction


    const userId = JSON.parse(Buffer.from(transaction.reference, 'base64').toString('ascii')).user_id

    const [user, userTransaction] = await Promise.all([
        context.app.service('users')
            .getModel()
            .query()
            .where({
                id: userId,
                deletedAt: null,
                status: 'active'
            })
            .then(it => it[0]),
        context.app.service('user-gateway-transactions')
            .getModel()
            .findOne({
                where: { gateway_reference: transaction.id, user_id: userId }
            })
    ])

    if (!user) {
        await context.app
            .service('user-gateway-transactions')
            .getModel()
            .update(
                {
                    status: TransactionStatus.PROCESSED,
                    gateway_status: 'FAILED'
                },
                {
                    where: { gateway_reference: transaction.id }
                }
            )

        replaceItems(context, {
            success: true,
            message: 'Payment already processed'
        })
        return context
    }


    const paymentConfirmation = {
        user_id: userId,
        payment_reference: transaction.id,
        invoice: '',
        description: '',
        value: userTransaction.amount,
        tax: 0,
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
        city: transaction?.shipping_address?.city || '',
        address: `${transaction.shipping_address?.address_line_1} - ${transaction.shipping_address?.address_line_2}`,
        payment_method: transaction.payment_method_type
    }

    const paymentConfirmationCreated = await context.app
        .service('payment-confirmations')
        .create(paymentConfirmation)

    if (transaction.status === 'APPROVED' && userTransaction.gateway_status === 'PENDING') {
        await context.app
            .service('wallet-movements')
            .getModel()
            .create({
                user_id: user.id,
                type: 'recharge',
                amount_net: userTransaction.amount,
                description: `Recarga wallet`,
                payment_id: paymentConfirmationCreated.id,
                created_by_user_id: user.id,
            })
    }

    await context.app
        .service('user-gateway-transactions')
        .getModel()
        .update(
            { status: TransactionStatus.PROCESSED, gateway_status: transaction.status },
            { where: { gateway_reference: transaction.id } }
        )


    replaceItems(context, {
        success: true,
        message: 'Payment updated'
    })

    return context
}


module.exports = () => async context => {
    const record = getItems(context)
    const wompi = context.app.get('wompiClient')
    const transaction = record.data.transaction
    const signature = record.signature
    const timestamp = record.timestamp

    const delay = new Promise((resolve) => setTimeout(resolve, 5000))

    await delay()

    const checksum = crypto.createHash('sha256')
        .update(signature.properties.reduce((acc, it) => acc += it.split('.').reduce((acc2, it2) => {
            if (acc2[it2]) acc2 = acc2[it2]
            return acc2
        }, record.data), '') + timestamp + wompi.eventsSecret)
        .digest('hex')

    if (checksum !== signature.checksum) throw new Forbidden('checksum not match')
    if (record.event !== 'transaction.updated') {
        replaceItems(context, { success: true, message: 'Evento no manejado.' })
        return context
    }

    const gatewayTransaction = await context.app.service('user-gateway-transactions')
        .getModel()
        .findOne({
            where: {
                gateway_reference: transaction.id
            }
        })

    if (!gatewayTransaction) {
        throw new NotFound('Transaction no found.')
        // replaceItems(context, { success: false, message: 'Transaction no found.' })
        // return context
    } else if (gatewayTransaction.status === TransactionStatus.PROCESSED) {
        replaceItems(context, { success: false, message: 'Transaction already processed.' })
        return context
    }

    if (gatewayTransaction.type === UserTransactionType.PAYMENT) {
        return await processPaymentOrder()(context)
    } else if (gatewayTransaction.type === UserTransactionType.WALLET_RECHARGE) {
        return await processPaymentRecharge()(context)
    } else {
        replaceItems(context, { success: false, message: 'Method no allowed' })
    }

    return context
}