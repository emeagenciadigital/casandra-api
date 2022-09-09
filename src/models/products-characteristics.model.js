// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class productsCharacteristics extends Model {
  static get tableName() {
    return "products_characteristics";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["product_id", "characteristic_id", "characteristic_value"],

      properties: {
        product_id: { type: "integer" },
        characteristic_id: { type: "integer" },
        characteristic_value: { type: "string" },
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
    .hasTable("products_characteristics")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("products_characteristics", (table) => {
            table.increments("id");
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("products")
              .index()
              .nullable();
            table
              .integer("characteristic_id")
              .unsigned()
              .references("id")
              .inTable("characteristics")
              .index()
              .nullable();
            table.string("characteristic_value");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created products_characteristics table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating products_characteristics table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) =>
      console.error("Error creating products_characteristics table", e)
    ); // eslint-disable-line no-console

  return productsCharacteristics;
};
