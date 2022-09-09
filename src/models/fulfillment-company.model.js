// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class fulfillmentCompany extends Model {
  static get tableName() {
    return "fulfillment_company";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string" },
        description: { type: ["string", "null"] },
        path: { type: ["string", "null"] },
        type: { type: "string", enum: ["weight", "units", "price", "volume"] },
        status: { type: "string", enum: ["active", "inactive"] },
        integration: { type: "string", enum: ["true", "false"] },
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
    .hasTable("fulfillment_company")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("fulfillment_company", (table) => {
            table.increments("id");
            table.string("name");
            table.text("description");
            table.string("path");
            table.enum("type", ["weight", "units", "price", "volume"]);
            table.enum("status", ["active", "inactive"]);
            table.enum("integration", ["true", "false"]);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created fulfillment_company table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating fulfillment_company table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating fulfillment_company table", e)); // eslint-disable-line no-console

  return fulfillmentCompany;
};
