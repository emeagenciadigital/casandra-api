// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotFound, NotAcceptable } = require('@feathersjs/errors');
const { getItems, replaceItems } = require('feathers-hooks-common');
const inside = require('point-in-polygon');
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    if (context.colvanes == 'true') return context;
    let coordinate = null;
    let query = null;
    const { lat, lng, city_id } = context.params.query;
    if (context.params.query.address_id) {
      const address = await context.app
        .service('addresses')
        .getModel()
        .findByPk(context.params.query.address_id)

      if (!address) throw new NotFound('No se encontró la dirección.');

      coordinate = [address.lat, address.lng];
      query = { city_id: address.city_id, deletedAt: null };
    } else if (lat && lng) {
      query = { city_id: city_id };
      coordinate = [lat, lng];
    } else {
      throw new NotAcceptable('Debes enviar parametros.');
    }

    const shippingCosts = await context.app
      .service('shipping-costs')
      .getModel()
      .query()
      .where({ ...query })
      .then((it) => it);

    let shippingCostSelect = null;
    for (let index = 0; index < shippingCosts.length; index++) {
      const shippingCost = shippingCosts[index];
      const ranges = JSON.parse(shippingCost.polygon);
      if (ranges.length >= 1) {
        const polygon = ranges.map((it) => [it.lat, it.lng]);

        if (inside(coordinate, polygon)) {
          shippingCostSelect = shippingCost;
          break;
        }
      }
    }

    if (!shippingCostSelect)
      // throw new NotAcceptable("No tenemos cubertura para tu ubicación.");

      context.result = {
        shippingCost: shippingCostSelect,
      };

    replaceItems(context, records);

    return context;
  };
};
