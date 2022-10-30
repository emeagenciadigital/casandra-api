// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { Op } = require("sequelize");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    let main = null;
    if (records.main == "true") {
      main = await context.app
        .service("addresses")
        .getModel()
        .findAll({
          where: {
            main: 'true',
            user_id: user.id
          }
        })
    }

    if (main && main.length > 1) {
      await context.app
        .service("addresses")
        .getModel()
        .update(
          { main: 'false' },
          { where: { user_id: user.id, id: { [Op.ne]: records.id } } }
        )
    }

    replaceItems(context, records);

    return context;
  };
};
