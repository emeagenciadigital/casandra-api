// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class banners extends Model {
  static get tableName() {
    return "banners";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
        path_movile: { type: "text" },
        path_desktop: { type: "text" },
        priority: { type: "integer" },
        type: {
          type: "string",
          enum: ["HOME", "OFFERS", "POPUP"],
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
        },
        deletedAt: { type: "date-tim" },
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
    .hasTable("banners")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("banners", (table) => {
            table.increments("id");
            table.text("path_movile");
            table.text("path_desktop");
            table.integer("priority").defaultTo(1);
            table.enum('type', ["HOME", "OFFERS", "POPUP"]);
            table.enum('status', ["active", "inactive"]).defaultTo('active');
            table.text("url");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => {}) // eslint-disable-line no-console
          .catch(() => {}); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating banners table", e)); // eslint-disable-line no-console

  return banners;
};
