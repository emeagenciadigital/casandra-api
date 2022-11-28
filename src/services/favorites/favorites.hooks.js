const registerFavorite = require("./hooks/register-favorite");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const { disallow, fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      let service = null;
      let query = null;
      switch (records.type) {
        case "product":
          service = "products";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "brand":
          service = "brands";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "blog":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "blog" };
          break;
        case "recipe":
          service = "recipes";
          query = { id: records.type_id, deletedAt: null };
          break;
        case "guide":
          service = "blogs-and-guides";
          query = { id: records.type_id, deletedAt: null, type: "guide" };
          break;
        case "coffee-shop-product":
          service = "coffee-shop-products";
          query = {
            id: records.type_id,
            deletedAt: null,
            type: "coffee-shop-product",
          };
          break;
        default:
          break;
      }

      if (
        service == "brand" ||
        service == "blog" ||
        service == "recipe" ||
        service == "recipe"
      ) {
        records.favorite = await context.app
          .service(service)
          .getModel()
          .query()
          .where(query)
          .then((it) => it[0]);
      } else if (service == "products")
        records.favorite = await context.app
          .service(service)
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
            "products.id": records.type_id,
            "products.deletedAt": null,
            "products_media.deletedAt": null,
          })
          .then((it) => it[0]);
      else if (service == "coffee-shop-products")
        records.favorite = await context.app
          .service(service)
          .getModel()
          .query()
          .select(
            "coffee_shop_products.id",
            "coffee_shop_products.name",
            "coffee_shop_products.price",
            "coffee_shop_products.type",
            "coffee_shop_products.status",
            "coffee_shop_products.image_path"
          )
          .where({
            "coffee_shop_products.id": records.type_id,
            "coffee_shop_products.deletedAt": null,
          })
          .then((it) => it[0]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [registerFavorite()],
    update: [],
    patch: [disallow("external")],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
