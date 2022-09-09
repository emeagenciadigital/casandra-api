// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require("moment");

const { getItems, replaceItems } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const [fulfillmentCompany, city] = await Promise.all([
      context.app
        .service("fulfillment-company")
        .getModel()
        .query()
        .where({ id: records.fulfillment_company_id, deletedAt: null })
        .then((it) => it[0]),
      context.app
        .service("locations-cities")
        .getModel()
        .query()
        .where({ id: records.location_city_id, deletedAt: null })
        .then((it) => it[0]),
    ]);

    if (!fulfillmentCompany)
      throw new NotFound("No se encontro la empresa transportadora.");
    if (!city) throw new NotFound("No se encontro la ciudad de destino.");

    records.integration_city_id = city.integration_id;

    replaceItems(context, records);

    return context;
  };
};
