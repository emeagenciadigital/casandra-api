
module.exports = () => async (context) => {
	const product = context.result

	if (!product || !product.integration_id) return context

	await context.app.service('products').getModel()
		.query()
		.patch({
			integration_hash: `${product.integration_id || ''}-${product.name}-${product.price || 0}-${product.quantity || 0}-${product.weight || 0}-${product.long || 0}-${product.width || 0}-${product.heigh || 0}-${product.tax_value || 0}-${product.is_ead}`
		})
		.where({ id: product.id })

	return context
}