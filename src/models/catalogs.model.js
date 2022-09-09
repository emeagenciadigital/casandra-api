// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class catalogs extends Model {
  static get tableName() {
    return "catalogs";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        name: { type: "string" },
        path_image: { type: "text" },
        path_file: { type: "text" },
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
    .hasTable("catalogs")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("catalogs", (table) => {
            table.increments("id");
            table.string("name");
            table.text("path_image");
            table.text("path_file");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created catalogs table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating catalogs table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating catalogs table", e)); // eslint-disable-line no-console

  return catalogs;
};
