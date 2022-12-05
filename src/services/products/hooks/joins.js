const moment = require('moment')

const joinGet = {
  joins: {
    join: () => async (records, context) => {
      const { user } = context.params;

      if (context.params.integration == "true") return context;
      [
        records.media,
        records.brand,
        records.tax,
        records.category,
        records.category_2,
        records.category_3,
        records.characteristics,
        // records.is_favorite,
        records.favorite_id,
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
        user && context.app
          .service('favorites')
          .getModel()
          .query()
          .select('id')
          .where({
            type_id: records.id,
            deletedAt: null,
            user_id: user.id
          })
          .then(res => res[0]?.id)
      ]);

      const now = moment().utcOffset(-5)
      const limitHourToFastShipment = moment(now)
        .set('h', 12)
        .set('m', 0)
        .set('s', 0)
        .utcOffset(-5)
      const weekDay = now.day()
      const businessDays = [1, 2, 3, 4, 5]

      let daysOfShipment = 0
      if (now.isBefore(limitHourToFastShipment) || !businessDays.includes(weekDay)) {
        daysOfShipment = 2
      } else {
        daysOfShipment = 3
      }

      if (now.day() === 0) now.add('days', 1)
      else if (now.day() === 6) now.add('days', 2)
      now.add('days', daysOfShipment)

      records.estimated_delivery_date = now.format('DD-MM-YYYY')
      records.is_favorite = !!records?.favorite_id
    },
  },
};

module.exports = joinGet;
