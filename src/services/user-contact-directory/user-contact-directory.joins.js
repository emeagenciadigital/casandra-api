const { fastJoin } = require("feathers-hooks-common")

module.exports.joinWithAllData = () => async (context) => {
  const app = context.app

  return fastJoin({
    joins: {
      join: () => async (record) => {
        [
          record.contact_directory,
          record.user,
        ] = await Promise.all([
          app.service('contacts-directory')
            .getModel()
            .findByPk(record.contact_directory_id),
          app.service('users')
            .getModel()
            .query()
            .select(
              'id',
              'first_name',
              'last_name',
              'email',
            )
            .where({
              id: record.user_id
            })
            .then(res => res[0]),
        ])
      }
    }
  })(context)
}
