const { fastJoin } = require('feathers-hooks-common')

exports.joinWithProduct = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      record.product = await context.app.service('products')
        .getModel()
        .query()
        .select(
          "products.id",
          "products.name",
          "products.price",
          "products.price_with_tax",
          "products.discount_price",
          "products.discount_price_whit_tax",
          "products.status",
          "products.slug",
          "products.course",
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
          "products.deletedAt": null,
          "products_media.deletedAt": null,
        })
        .then(res => res[0])
    }
  }
})