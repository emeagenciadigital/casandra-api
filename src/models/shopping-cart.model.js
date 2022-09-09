// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shoppingCart extends Model {
  static get tableName() {
    return "shopping_cart";
  }

  static get relationMappings() {
    const shoppingCartDetailsModel = require("./shopping-cart-details.model")();
    const userModel = require("./users.model")();

    return {
      shopping_cart_details: {
        relation: Model.HasManyRelation,
        modelClass: shoppingCartDetailsModel,
        join: {
          from: "shopping_cart.id",
          to: "shopping_cart_details.shopping_cart_id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: userModel,
        join: {
          from: "shopping_cart.user_id",
          to: "user.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["status"],

      properties: {
        user_id: { type: "integer" },
        token: { type: "string, null", maxLength: 255 },
        status: { type: "string", enum: ["active", "inactive", "completed"] },
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
      .hasTable("shopping_cart")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("shopping_cart", (table) => {
              table.increments("id");
              table
                .integer("user_id")
                .unsigned()
                .references("id")
                .inTable("users")
                .index();
              table
                .enum("status", ["active", "inactive", "completed"])
                .defaultTo("active");
              table.enum("type", ["credit", "paid_in_full"]);
              table.string("token").unique();
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created shopping_cart table")) // eslint-disable-line no-console
            .catch((e) =>
              console.error("Error creating shopping_cart table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating shopping_cart table", e)); // eslint-disable-line no-console
  }

  return shoppingCart;
};
