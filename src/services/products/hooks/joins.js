const joinGet = {
  joins: {
    join: () => async (records, context) => {
      const { user } = context.params;

      if (context.params.integration == "true") return context;
      [
        records.media,
        records.brand,
        tax,
        records.category,
        records.category_2,
        records.category_3,
        records.characteristics,
      ] = await Promise.all([
        context.app
          .service("products-media")
          .getModel()
          .query()
          .where({
            product_id: records.id,
            deletedAt: null,
          })
          .then((it) => it),
        context.app
          .service("brands")
          .getModel()
          .query()
          .where({
            id: records.brand_id,
            deletedAt: null,
          })
          .then((it) => it[0]),
        context.app
          .service("tax-rule")
          .getModel()
          .query()
          .where({ id: records.tax_rule_id })
          .then((it) => it[0]),
        context.app
          .service("categories")
          .getModel()
          .query()
          .where({ id: records.category_id })
          .then((it) => it[0]),
        context.app
          .service("categories")
          .getModel()
          .query()
          .where({ id: records.category_id_2 })
          .then((it) => it[0]),
        context.app
          .service("categories")
          .getModel()
          .query()
          .where({ id: records.category_id_3 })
          .then((it) => it[0]),
        context.app
          .service("products-characteristics")
          .getModel()
          .query()
          .select("characteristics.name AS name", "products_characteristics.*")
          .innerJoin(
            "characteristics",
            "characteristics.id",
            "=",
            "products_characteristics.characteristic_id"
          )
          .where({
            product_id: records.id,
            "products_characteristics.deletedAt": null,
          }),
      ]);
    },
  },
};

module.exports = joinGet;
