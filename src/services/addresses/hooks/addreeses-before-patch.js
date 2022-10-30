// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require('feathers-hooks-common');
const { NotFound } = require('@feathersjs/errors');
// eslint-disable-next-line no-unused-vars
module.exports = () => {
  return async (context) => {
    let records = getItems(context);

    if (records.city_id && records.state_id) {
      const state = await context.app
        .service('locations-states')
        .getModel()
        .findByPk(records.state_id)

      if (!state) throw new NotFound('No se encontró el departamento enviado.');

      const city = await context.app
        .service('locations-cities')
        .getModel()
        .findOne({ where: { state_id: state.id, id: records.city_id } })

      if (!city) throw new NotFound('No se encontró la ciudad enviada.');

      records.city_id = city.id;
      records.state_id = state.id;
    }

    replaceItems(context, records);

    return context;
  };
};
