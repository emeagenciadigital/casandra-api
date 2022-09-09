// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class configurations extends Model {
  static get tableName() {
    return "configurations";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "key", "value"],
      properties: {
        name: { type: "string", maxlength: 255 },
        key: { type: "string", maxlength: 255 },
        value: { type: "string" },
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
  const db = app.get("knex");

  db.schema
    .hasTable("configurations")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("configurations", (table) => {
            table.increments("id");
            table.string("name");
            table.string("key");
            table.text("value");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created configurations table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating configurations table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating configurations table", e)); // eslint-disable-line no-console

  return configurations;
};
