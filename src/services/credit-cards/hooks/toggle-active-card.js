const { getItems } = require('feathers-hooks-common')

module.exports = () => async context => {
    const payload = getItems(context)

    if (payload.default !== 'true') return context
    
    await context.service.getModel().query()
        .patch({default: 'false'})
        .where({ user_id: payload.user_id, default: 'true' })

    return context;
}