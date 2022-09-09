// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class design extends Model {
  static get tableName() {
    return "design";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["location", "name", "component", "data", "priority", "code"],

      properties: {
        location: { type: "string" },
        name: { type: "string" },
        component: { type: "string" },
        code: { type: "string" },
        data: { tye: "string" },
        priority: { type: "integer" },
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
    .hasTable("design")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("design", (table) => {
            table.increments("id");
            table.string("name");
            table.string("location");
            table.string("component");
            table.text("data");
            table.string("code");
            table.integer("priority");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created design table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating design table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating design table", e)); // eslint-disable-line no-console

  return design;
};
