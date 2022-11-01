const { NotAcceptable } = require('@feathersjs/errors')
const { getItems, replaceItems } = require('feathers-hooks-common')

const AVAILABLE_PAYMENT_METHODS = ['credit_card', 'pse', 'bancolombia', 'nequi']
const AVAILABLE_GATEWAYS = ['wompi']

const STATUS_PENDING_PAYMENT = 1
const ID_URL_CONFIRMATION = 1

module.exports = () => async context => {
    const record = getItems(context)
    const user = context.params.user

    if (!AVAILABLE_PAYMENT_METHODS.includes(record.payment_method))
        throw new NotAcceptable('Payment method is no allowed!')

    if (!AVAILABLE_GATEWAYS.includes(record.gateway))
        throw new NotAcceptable('Gateway is not allowed!')

    const [order, creditCard, urlConfirmation] = await Promise.all([
        context.app.service('orders')
            .getModel()
            .query()
            .where({
                id: record.order_id,
                user_id: user.id,
                order_status_id: STATUS_PENDING_PAYMENT,
                deletedAt: null
            })
            .then(it => it[0]),
        record.credit_card_id ? context.app.service('credit-cards')
            .getModel()
            .query()
            .select([
                'id',
                'user_id',
                'credit_card_token_id',
                'owner_name',
                'exp_year',
                'exp_month',
                'masked_number',
                'gateway',
                'brand',
                'default',
                'default_payment_fees',
                'verified_status',
                'credit_card_source_payment_id',
            ])
            .where({
                id: record.credit_card_id,
                user_id: user.id,
                deletedAt: null
            })
            .then(it => it[0]) : undefined,
        context.app
            .service('configurations')
            .getModel()
            .query()
            .where({
                id: ID_URL_CONFIRMATION
            })
            .then((it) => it[0]),
    ])

    if (!order) throw new NotAcceptable('The order not exists.')
    if (record.payment_method === 'credit_card') {
        if (!creditCard) throw new NotAcceptable('Then credit card not exists.')
        else if (creditCard.verified_status !== 'verified') throw new NotAcceptable('La tarjeta de crédito no ha sido verificada.')
        else if (record.gateway !== creditCard.gateway) throw new NotAcceptable('Invalid credit card!')
    }

    if (order.payment_method !== 'online')
        throw new NotAcceptable('Order type payment not allowed')

    record.order = order
    record.creditCard = creditCard
    record.urlConfirmation = `${urlConfirmation.value}/${order.id}`

    replaceItems(context, record)

    return context
}