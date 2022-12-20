const { fastJoin, getItems } = require("feathers-hooks-common")
const { getProductPrices } = require("../../utils/price-list/prices")

exports.courseDetailJoin = () => (context) => {
  const app = context.app

  return fastJoin({
    joins: {
      join: () => async (record) => {
        [
          record.category,
          record.sections,
          record.benefits,
        ] = await Promise.all([
          app.service('courses-categories')
            .getModel()
            .findByPk(record.category_id),
          app.service('course-sections')
            .getModel()
            .findAll({
              include: [
                {
                  association: 'chapters',
                  attributes: { exclude: !record.bought ? ['path_video'] : [] }
                }
              ],
              where: {
                course_id: record.id
              }
            }),
          app.service('course-benefits')
            .getModel()
            .findAll({
              where: {
                course_id: record.id
              }
            })
        ])
      }
    }
  })(context)
}

exports.courseProductJoin = () => async (context) => {

  const records = getItems(context)
  const user = context.params.user
  const productIds = (Array.isArray(records) ? records : [records])
    .map(it => it.product_id)

  const prices = await getProductPrices(user)(productIds)(context)

  return fastJoin({
    joins: {
      join: () => async (record) => {
        record.product = await context.app.service('products')
          .getModel()
          .query()
          .select([
            'id',
            'name',
            'price',
            'price_with_tax',
            'discount_price',
            'discount_price_whit_tax'
          ])
          .where({
            id: record.product_id,
            deletedAt: null
          })
          .then(res => res[0] || {})
          .then(res => ({
            ...res,
            ...(prices.find(it => it.product_id === res.id) || {})
          }))
      }
    }
  })(context)
}

exports.joinWithUserCourses = () => (context) => {
  const user = context.params.user
  if (!user) return context

  return fastJoin({
    joins: {
      join: () => async (record) => {
        record.user_course = await context.app
          .service('user-courses')
          .getModel()
          .findOne({ where: { course_id: record.id, user_id: user.id } })
        record.bought = !!record.user_course
      }
    }
  })(context)
}