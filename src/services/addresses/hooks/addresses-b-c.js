// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotFound } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const state = await context.app
      .service("locations-states")
      .getModel()
      .query()
      .where({
        id: records.state_id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (!state) throw new NotFound("No se encontro el departamento enviado.");

    const city = await context.app
      .service("locations-cities")
      .getModel()
      .query()
      .where({
        state_id: state.id,
        id: records.city_id,
        deletedAt: null,
      })
      .then((it) => it[0]);

    if (!city) throw new NotFound("No se encontro la ciudad enviada.");

    records.user_id = user.id;
    records.city_id = city.id;
    records.state_id = state.id;

    replaceItems(context, records);

    return context;
  };
};