// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class characteristics extends Model {
  static get tableName() {
    return "characteristics";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string" },
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
    .hasTable("characteristics")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("characteristics", (table) => {
            table.increments("id");
            table.string("name");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created characteristics table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating characteristics table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating characteristics table", e)); // eslint-disable-line no-console

  return characteristics;
};
