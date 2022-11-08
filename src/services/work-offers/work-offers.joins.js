const { fastJoin } = require("feathers-hooks-common")

exports.withJoins = () => (context) => {
  return fastJoin({
    joins: {
      join: () => async (record) => {
        [record.category, record.city] = await Promise.all([
          context.app.service('work-offers-categories')
            .getModel()
            .findByPk(record.category_id, { attributes: ['id', 'name'] }),
          context.app.service('locations-cities')
            .getModel()
            .findByPk(record.city_id, {
              attributes: ['id', 'name'],
              include: [{ association: 'state', attributes: ['id', 'name'] }]
            })
        ])
      }
    }
  })(context)
}