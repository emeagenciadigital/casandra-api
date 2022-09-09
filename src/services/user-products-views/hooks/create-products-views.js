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

    if (!user && !records.off_line_token)
      throw new NotAcceptable("Debes enviar el token.");

    if (!records.product_id)
      throw new NotAcceptable("Debes enviar el producto.");

    records.user_id = user ? user.id : null;
    records.off_line_token = !user ? records.off_line_token : null;

    records.status = "active";
    return context;
  };
};

function error(msg) {
  throw new Error(msg);
}
