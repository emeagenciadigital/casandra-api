// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class userProductsViews extends Model {
  static get tableName() {
    return "user_products_views";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["product_id"],

      properties: {
        product_id: { type: "integer" },
        user_id: { type: ["integer", "null"] },
        off_line_token: { type: ["string", "null"] },
        status: { type: "string", enum: ["active", "inactive"] },
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
  const db = app.get("knex");

  db.schema
    .hasTable("user_products_views")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("user_products_views", (table) => {
            table.increments("id");
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("products")
              .nullable()
              .index();
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .nullable()
              .index();
            table.string("off_line_token");
            table.enum("status", ["active", "inactive"]).defaultTo("active");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created user_products_views table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating user_products_views table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating user_products_views table", e)); // eslint-disable-line no-console

  return userProductsViews;
};
