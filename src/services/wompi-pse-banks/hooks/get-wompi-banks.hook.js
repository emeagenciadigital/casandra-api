const { replaceItems } = require("feathers-hooks-common")

module.exports = () => async context => {
    const wompi = context.app.get('wompiClient')

    const data = await wompi.getPseBanks()

    replaceItems(context, data)

    return context
}