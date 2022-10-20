const {
	getItems,
} = require("feathers-hooks-common");
// const algolia = require("../../../utils/algolia");

module.exports = (keyId) => async (context) => {

	const productsModel = context.app.service('products').getModel()

	let records = getItems(context);
	if (records.length > 0) records = records[0];

	const productsIds = await productsModel.query()
		.select('id')
		.where({ label_id: records[keyId], deletedAt: null })


	await productsModel.query().update({
		label_id: null,
		label_name: null,
		label_position: null,
		label_start_date: null,
		label_end_date: null,
		label_path: null,
	}).where({ label_id: records[keyId] })

	// const algoliaCredemtials = context.app.get("algolia");
	// const Algolia = new algolia(
	// 	'products',
	// 	algoliaCredemtials.appId,
	//   algoliaCredemtials.apiKey
	// )

	const objects = productsIds.map(it => ({
		id: it.id,
		label_id: null,
		label_name: null,
		label_position: null,
		label_start_date: null,
		label_end_date: null,
		label_path: null
	}))

	// Algolia.patchAll(objects)
	context.app.service('meilisearch').patch(null, objects)

	return context
}