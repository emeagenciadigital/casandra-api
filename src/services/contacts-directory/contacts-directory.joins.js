const { fastJoin } = require("feathers-hooks-common")

module.exports.joinWithAllData = () => async (context) => {
  const app = context.app

  return fastJoin({
    joins: {
      join: () => async (record) => {
        [
          record.city,
          record.category,
          record.attributes,
          record.media
        ] = await Promise.all([
          app.service('locations-cities')
            .getModel()
            .findByPk(record.city_id),
          app.service('contacts-directory-categories')
            .getModel()
            .findByPk(record.category_id),
          app.service('contacts-directory-attributes')
            .getModel()
            .findAll({ where: { contact_directory_id: record.id } }),
          app.service('contacts-directory-media')
            .getModel()
            .findAll({ where: { contact_directory_id: record.id } })
        ])
      }
    }
  })(context)
}
