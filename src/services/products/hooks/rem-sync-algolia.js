// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require('@feathersjs/errors');
// const algolia = require('../../../utils/algolia/');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { path, id } = context;
    let { query } = context.params;
    let record = null;

    if (Object.keys(query).length === 0 && !id) {
      throw new NotAcceptable('Debes enviar un id , o un query');
    }

    query = Object.keys(query).length === 0 ? { id } : query;

    record = await context.app
      .service(`${path}`)
      .getModel()
      .query()
      .patch({ deletedAt: new Date().toISOString() })
      .where(query);

    //vefiricar que se elimine con el query o con id
    record = await context.app
      .service(`${path}`)
      .getModel()
      .query()
      .where(query)
      .whereNot('deletedAt', null)
      .then((it) => it[0]);

    // const algoliaCredemtials = context.app.get('algolia');

    // const Algolia = new algolia(
    //   'products',
    //   algoliaCredemtials.appId,
    //   algoliaCredemtials.apiKey
    // );

    // Algolia.remove(record.id);
    context.app.service('meilisearch').remove(`product-${record.id}`)

    context.result = record;
    return context;
  };
};
