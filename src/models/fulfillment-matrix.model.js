// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class fulfillmentMatrix extends Model {
  static get tableName() {
    return "fulfillment_matrix";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "fulfillment_company_id",
        "destination_city_id",
        "destination_city_dane",
        "type",
        "min",
        "max",
        "price",
      ],

      properties: {
        fulfillment_company_id: { type: "integer" },
        destination_city_id: { type: "integer" },
        destination_city_dane: { type: "string" },
        type: { type: "string", enum: ["weight", "units", "price", "volume"] },
        min: { type: "integer" },
        max: { type: "integer" },
        price: { type: "number" },
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
    .hasTable("fulfillment_matrix")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("fulfillment_matrix", (table) => {
            table.increments("id");
            table
              .integer("fulfillment_company_id")
              .unsigned()
              .references("id")
              .inTable("fulfillment_company")
              .index()
              .nullable();
            table
              .integer("destination_city_id")
              .unsigned()
              .references("id")
              .inTable("locations_cities")
              .index()
              .nullable();
            table.string("destination_city_dane");
            table.enum("type", ["weight", "units", "price", "volume"]);
            table.integer("min");
            table.integer("max");
            table.double("price");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created fulfillment_matrix table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating fulfillment_matrix table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating fulfillment_matrix table", e)); // eslint-disable-line no-console

  return fulfillmentMatrix;
};
