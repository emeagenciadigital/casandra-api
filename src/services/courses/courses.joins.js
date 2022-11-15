const { fastJoin } = require("feathers-hooks-common")

exports.courseDetailJoin = () => (context) => {
  const app = context.app

  return fastJoin({
    joins: {
      join: () => async (record) => {
        [
          record.category,
          record.sections,
          record.benefits,
          record.product
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
            }),
          app.service('products')
            .getModel()
            .query()
            .where({
              id: record.product_id,
              deletedAt: null
            })
        ])
      }
    }
  })(context)
}

exports.courseProductJoin = () => (context) => {

  return fastJoin({
    joins: {
      join: () => async (record) => {
        [record.product] = await context.app.service('products')
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
        record.bought = await context.app
          .service('user-courses')
          .getModel()
          .findOne({ where: { course_id: record.id, user_id: user.id } })
          .then((res) => !!res)
      }
    }
  })(context)
}