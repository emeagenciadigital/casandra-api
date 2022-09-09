// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const registerOrderHistory = require("../../../hooks/register-order-history");
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    let records = getItems(context);

    const { user } = context.params;

    const products = context.dataOrders.shoppingCartDetails;

    for (const key in products) {
      const product = products[key];
      await context.app
        .service("products")
        .getModel()
        .query()
        .where("id", "=", product.id)
        // .andWhere(function () {
        //   this.where('is_ead', null).orWhere('is_ead', 0)
        // })
        .decrement("quantity", product.shopping_cart_details_quantity);
    }

    replaceItems(context, records);

    return context;
  };
};
