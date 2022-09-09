const { checkContext, getItems, required } = require("feathers-hooks-common");
const { NotAcceptable } = require("@feathersjs/errors");
module.exports = function (options = {}) {
  return async (context) => {
    checkContext(context, null, [
      "find",
      "get",
      "create",
      "update",
      "patch",
      "remove",
    ]);

    const records = getItems(context);

    const { user } = context.params;

    if (!records.off_line_token)
      throw new NotAcceptable("Debe enviar el token.");

    await context.app
      .service("user-products-views")
      .getModel()
      .query()
      .patch({ user_id: user.id, off_line_token: null })
      .where({ off_line_token: records.off_line_token, user_id: null });

    context.result = [];

    return context;
  };
};

function error(msg) {
  throw new Error(msg);
}
