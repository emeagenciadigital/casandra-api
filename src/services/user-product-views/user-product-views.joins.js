const { fastJoin } = require("feathers-hooks-common")

exports.withProductJoin = () => async (context) => {
  if (context.params.userViewProduct !== 'true') return context

  return fastJoin({
    joins: {
      join: () => async (record) => {
        record.product = await context.app.service('products')
          .getModel()
          .query()
          .select(
            'products.*',
            "products_media.type AS type_media",
            "products_media.path AS main_image",
            "products_media.id AS products_media_id"
          )
          .innerJoin(
            "products_media",
            "products.id",
            "=",
            "products_media.product_id"
          )
          .where({
            "products.id": record.product_id,
            "products.status": 'active',
            "products.deletedAt": null,
            "products_media.deletedAt": null,
          })
          .then(res => res[0])
      }
    }
  })(context)
}