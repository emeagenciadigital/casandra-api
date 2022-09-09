const { getItems, replaceItems } = require("feathers-hooks-common")
const creditCardPaymentWompi = require("./gateways-methods/credit-card-payment.wompi")
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
            }
            break
        case 'other':
            // TODO
            break
    }

    replaceItems(context, response)

    return context
}