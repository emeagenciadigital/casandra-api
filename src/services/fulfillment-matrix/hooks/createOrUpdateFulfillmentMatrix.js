// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const moment = require("moment");

const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const [fulfillmentCOmpany, destinationCity] = await Promise.all([
      context.app
        .service("fulfillment-company")
        .getModel()
        .query()
        .where({ id: records.fulfillment_company_id, deletedAt: null })
        .then((it) => it[0]),
      context.app
        .service("locations-cities")
        .getModel()
        .findByPk(records.destination_city_id),
    ]);

    if (!fulfillmentCOmpany)
      throw new NotFound("No se encontro la empresa transportadora.");
    if (!destinationCity)
      throw new NotFound("No se encontro la ciudad de destino.");

    if (records.min > records.max)
      throw new NotAcceptable("El valor minimo no puede ser mayor al maximo.");

    records.destination_city_dane = destinationCity.dane_code;
    replaceItems(context, records);

    return context;
  };
};
