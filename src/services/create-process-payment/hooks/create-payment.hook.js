const { getItems, replaceItems } = require("feathers-hooks-common")
const bancolombiaPaymentWompi = require("./gateways-methods/bancolombia-payment.wompi")
const creditCardPaymentWompi = require("./gateways-methods/credit-card-payment.wompi")
const nequiPaymentWompi = require("./gateways-methods/nequi-payment.wompi")
const psePaymentWompi = require("./gateways-methods/pse-payment.wompi")

module.exports = () => async context => {
    const record = getItems(context)

    let response = null

    switch (record.gateway) {
        case 'wompi':
            if (record.payment_method === 'credit_card') {
                response = await creditCardPaymentWompi(context)
            } else if (record.payment_method === 'pse') {
                response = await psePaymentWompi(context)
            } else if (record.payment_method === 'bancolombia') {
                response = await bancolombiaPaymentWompi(context)
            } else if (record.payment_method === 'nequi') {
                response = await nequiPaymentWompi(context)
            }
            break
        case 'other':
            // TODO
            break
    }

    replaceItems(context, response)

    return context
}