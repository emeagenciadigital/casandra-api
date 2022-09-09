const { replaceItems } = require("feathers-hooks-common")

module.exports = () => async context => {
    const wompi = context.app.get('wompiClient')

    const response = await wompi.createMerchant()

    replaceItems(context, response)

    return context
}