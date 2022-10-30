// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
const { Op } = require("sequelize");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const state = await context.app
      .service("locations-states")
      .getModel()
      .findOne({
        where: records.state_id
          ? { id: records.state_id }
          : { name: { [Op.like]: `${records.state.trim()}%` } }
      })

    if (!state) throw new NotFound("No se encontró el departamento enviado.");

    const city = await context.app
      .service("locations-cities")
      .getModel()
      .findOne({
        where: {
          state_id: state.id,
          ...(records.city_id
            ? { id: records.city_id }
            : { name: { [Op.like]: `${records.city.trim()}%` } }
          )
        }
      })

    if (!city) throw new NotFound("No se encontró la ciudad enviada.");

    records.user_id = user.id;
    records.city_id = city.id;
    records.state_id = state.id;
    records.city_name = city.name
    records.state_name = state.name

    replaceItems(context, records);

    return context;
  };
};
