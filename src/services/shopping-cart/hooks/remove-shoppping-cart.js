// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { NotAcceptable } = require("@feathersjs/errors");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { path, id } = context;

    if (id) {
      let record = undefined;
      record = await context.app.service(`${path}`).get(id);

      if (context.token)
        record = await context.app
          .service(`${path}`)
          .getModel()
          .query()
          .where({ token: context.token, id: id })
          .then((it) => it[0]);

      await context.app
        .service(`${path}`)
        .getModel()
        .query()
        .patch({ deletedAt: new Date().toISOString() })
        .where("id", record.id);

      recors = await context.app
        .service(`${path}`)
        .getModel()
        .query()
        .where("id", record.id)
        .whereNot("deletedAt", null);

      context.result = record;
    }

    return context;
  };
};
