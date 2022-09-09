const { Forbidden } = require('@feathersjs/errors')

module.exports = () => context => {
	const { user, query, checkIfApplicable, shopping_cart_id } = context.params

	if (user && user.role !== 'admin') {
		if (context.method === 'find') {
			if (checkIfApplicable === 'true') {
				if (!query.code || !shopping_cart_id) throw new Forbidden()
			} else throw new Forbidden()
		} else throw new Forbidden()
	}

	return context
}