module.exports = () => async context => {

	await context.app.service('labels-conditions').getModel()
		.query()
		.update({ deletedAt: new Date().toISOString() })
		.where({ label_id: context.id })

	return context
}