// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class fulfillmentCities extends Model {
  static get tableName() {
    return "fulfillment_cities";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["fulfillment_company_id", "location_city_id"],

      properties: {
        fulfillment_company_id: { type: "integer" },
        location_city_id: { type: "integer" },
        integration_city_id: { type: ["string", "null"] },
        min_delivery_days: { type: ["integer", "null"], default: null },
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
    .hasTable("fulfillment_cities")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("fulfillment_cities", (table) => {
            table.increments("id");
            table
              .integer("fulfillment_company_id")
              .unsigned()
              .references("id")
              .inTable("fulfillment_company")
              .index();
            table
              .integer("location_city_id")
              .unsigned()
              .references("id")
              .inTable("locations_cities")
              .index();
            table.string("integration_city_id");
            table
              .integer("min_delivery_days")
              .unsigned()
              .nullable()
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created fulfillment_cities table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating fulfillment_cities table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating fulfillment_cities table", e)); // eslint-disable-line no-console

  return fulfillmentCities;
};
