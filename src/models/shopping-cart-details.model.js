// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shoppingCartDetails extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "shopping_cart_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["shopping_cart_id", "product_id", "quantity"],

      properties: {
        shopping_cart_id: { type: "integer" },
        product_id: { type: "integer" },
        quantity: { type: "integer" },
        deletedAt: { type: "string", format: "date-time" },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = function (app) {
  if (app) {
    const db = app.get("knex");

    db.schema
      .hasTable("shopping_cart_details")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("shopping_cart_details", (table) => {
              table.increments("id");
              table
                .integer("shopping_cart_id")
                .unsigned()
                .references("id")
                .inTable("shopping_cart")
                .index();
              table
                .integer("product_id")
                .unsigned()
                .references("id")
                .inTable("products")
                .index();
              table.integer("quantity");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created shopping_cart_details table")) // eslint-disable-line no-console
            .catch((e) =>
              console.error("Error creating shopping_cart_details table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch((e) =>
        console.error("Error creating shopping_cart_details table", e)
      ); // eslint-disable-line no-console
  }

  return shoppingCartDetails;
};
