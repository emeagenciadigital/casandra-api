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
                  attributes: { exclude: ['path_video'] }
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