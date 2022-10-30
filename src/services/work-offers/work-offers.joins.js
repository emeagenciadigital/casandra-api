const { fastJoin } = require("feathers-hooks-common")

exports.withCategoryJoin = () => (context) => {
  return fastJoin({
    joins: {
      join: () => async (record) => {
        record.category = await context.app.service('work-offers-categories')
          .getModel()
          .findByPk(record.category_id, { attributes: ['id', 'name'] })
      }
    }
  })(context)
}