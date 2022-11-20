const { getItems, replaceItems } = require("feathers-hooks-common")
const { getProductPrices } = require("../../../utils/price-list/prices")

module.exports = () => async (context) => {
  const records = getItems(context)
  const user = context.params.user

  const productsPrices = await getProductPrices(user)(
    (Array.isArray(records) ? records : [records]).map(it => it.id)
  )(context)

  replaceItems(context, Array.isArray(records) ? records.map(record => ({
    ...record,
    ...(productsPrices.find(it => it.product_id === record.id) || {})
  })) : {
    ...records,
    ...(productsPrices.find(it => it.product_id === records.id) || {})
  })

  return context
}