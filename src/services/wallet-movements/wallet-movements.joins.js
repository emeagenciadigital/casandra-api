const { fastJoin } = require("feathers-hooks-common")

exports.withUserJoin = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      const user = context.params.user
      if (user.id !== record.user_id) {
        record.user = await context.app.service('users')
          .getModel()
          .query()
          .select(
            'id',
            'first_name',
            'last_name',
            'email'
          )
          .where({ id: record.user_id })
      }
    }
  }
})