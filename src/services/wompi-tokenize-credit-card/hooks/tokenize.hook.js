const { NotAcceptable, GeneralError } = require('@feathersjs/errors')
const { getItems } = require('feathers-hooks-common')

const brands = {
    'AMEX': 'american-express',
    'MASTERCARD': 'mastercard',
    'VISA': 'visa',
}


const isValidPayload = (payload, requiredFields) => {
    const keys = Object.keys(payload)

    return requiredFields.every(it => keys.includes(it))
}

module.exports = () => async context => {
    const data = getItems(context)
    const requiredFields = ['number', 'cvc', 'exp_month', 'exp_year', 'card_holder']

    if (!isValidPayload(data, requiredFields)) throw new NotAcceptable('El cuerpo de la solicitud es incorrecto.')

    const wompi = context.app.get('wompiClient')

    const response = await wompi.tokenizeCard(data)

    if (response.status === 'CREATED') {
        const responseData = response.data

        const acceptanceToken = await wompi.getAcceptanceToken()
        if (!acceptanceToken) throw new NotAcceptable('No fué posible crear la tarjeta.')

        const paymentSource = await wompi.createPaymentSource({
            customer_email: context.params.user.email,
            type: 'CARD',
            token: responseData.id,
            acceptance_token: acceptanceToken,
        })

        if (!paymentSource) throw new NotAcceptable('No fué posible crear la tarjeta.')

        const dataCard = {
            masked_number: responseData.name,
            default: "true",
            brand: brands[responseData.brand] || 'unknown',
            credit_card_token_id: responseData.id,
            credit_card_source_payment_id: `${paymentSource.data.id}`,
            exp_year: Number(responseData.exp_year),
            exp_month: Number(responseData.exp_month),
            gateway: 'wompi',
            default_payment_fees: 12,
            user_id: context.params.user.id,
            owner_name: responseData.card_holder,
            meta_data: JSON.stringify(response),
        }
        const result = await context.app.service('credit-cards').create(dataCard)
        context.result = result
    } else {
        throw new GeneralError()
    }

    return context
}