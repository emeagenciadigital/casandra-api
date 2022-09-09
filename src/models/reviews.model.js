// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class reviews extends Model {
  static get tableName() {
    return "reviews";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "order_id", "product_id", "score", "message"],

      properties: {
        user_id: { type: "integer" },
        order_id: { type: "integer" },
        product_id: { type: "integer" },
        score: { type: "number" },
        message: { type: "text" },
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
    .hasTable("reviews")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("reviews", (table) => {
            table.increments("id");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index()
              .nullable();
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index()
              .nullable();
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("products")
              .index()
              .nullable();
            table.double("score");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created reviews table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating reviews table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating reviews table", e)); // eslint-disable-line no-console

  return reviews;
};
