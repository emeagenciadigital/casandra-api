const { checkContext, getItems, replaceItems } = require('feathers-hooks-common');

module.exports = () => async (context) => {
  checkContext(context, null, ['find']);

  const { user } = context.params;
  const records = getItems(context);

  if (!user) {
    delete context.params.query.q;
    return context;
  }

  if (context.params.query.q && user.role === 'admin') {
    const search = context.params.query.q;
    delete context.params.query.q;

    const storesIds = await context.app.service('stores').getModel()
      .query()
      .select('stores.id')
      .innerJoin('locations_cities', 'stores.location_city_id', '=', 'locations_cities.id')
      .orWhere('stores.name', 'LIKE', `%${search}%`)
      .orWhere('stores.address', 'LIKE', `%${search}%`)
      .orWhere('locations_cities.name', 'LIKE', `%${search}%`)
      .where({'stores.deletedAt': null})
      .then((it) => it.map((x) => x.id));

    // eslint-disable-next-line require-atomic-updates
    context.params.query['id'] = {$in: storesIds};
  }

  replaceItems(context, records);
  return context;
}