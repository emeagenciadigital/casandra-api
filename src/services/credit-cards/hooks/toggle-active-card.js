const { getItems } = require('feathers-hooks-common')

module.exports = () => async context => {
    const record = getItems(context)

    if (record.default !== 'true') return context

    await context.service.getModel().query()
        .patch({ default: 'false' })
        .whereNot({ id: record.id })

    return context;
}