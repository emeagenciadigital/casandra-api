const {
  checkContext,
  getItems,
  replaceItems,
} = require("feathers-hooks-common");
const { NotAcceptable, NotFound } = require("@feathersjs/errors");

module.exports = function (options = {}) {
  return async (context) => {
    checkContext(context, null, ["create"]);

    const { user } = context.params;

    const records = getItems(context);

    const product = await context.app
      .service("products")
      .getModel()
      .query()
      .where({ id: records.product_id, deletedAt: null })
      .limit(1)
      .then((it) => it[0]);
    
    let { review_score = 0, review_quantity = 0 } = product;

    //ESTABLECIMIENTOS
    let scorePerQuantity = review_score * review_quantity;

    let totalEstablishment = scorePerQuantity + parseInt(records.score);

    let rating_score = totalEstablishment / parseInt(review_quantity + 1);

    await Promise.all([
      context.app.service("products").patch(product.id, {
        review_score: rating_score,
        review_quantity: review_quantity + 1,
      }),
    ]);

    replaceItems(context, records);
    return context;
  };
};

const error = (type, msg) => {
  throw new type(msg);
};
