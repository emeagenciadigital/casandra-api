// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class Addresses extends Model {
  static get tableName() {
    return "addresses";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["main"],

      properties: {
        name: { type: "string", maxLength: 255 },
        address: { type: "string", maxLength: 255 },
        company_id: { type: "integer" },
        city_id: { type: "integer" },
        state_id: { type: "integer" },
        details: { type: "string" },
        main: { type: "string", enum: ["true", "false"] },
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
      .hasTable("addresses")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("addresses", (table) => {
              table.increments("id");
              table.string("name", 255);
              table.string("address", 255);
              table
                .integer("city_id")
                .unsigned()
                .references("id")
                .inTable("locations_cities")
                .index();
              table
                .integer("state_id")
                .unsigned()
                .references("id")
                .inTable("locations_states")
                .index();
              table.double("lat");
              table.double("lng");
              table.string("details");
              table.enum("main", ["true", "false"]);
              table.string("integration_nit");
              table.integer("integration_codigo_direccion");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => {}) // eslint-disable-line no-console
            .catch((e) => {}); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating addresses table", e)); // eslint-disable-line no-console
  }

  return Addresses;
};
