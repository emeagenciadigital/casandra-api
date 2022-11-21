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
          enum: ["HOME", "OFFERS", "POPUP", "ACADEMY", "FLASH_SALE"],
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
        },
        action_type: {
          type: 'string',
          enum: ["BANNER_PRODUCTS", 'CATEGORY', 'PRODUCT', 'URL', 'COURSE'],
        },
        url: {
          type: 'string',
        },
        action_id: {
          type: 'number',
        },
        start_date: {
          type: 'date-tim'
        },
        end_date: {
          type: 'date-tim'
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
            table.integer("action_id")
            table.enum('type', ["HOME", "OFFERS", "POPUP", "ACADEMY", "FLASH_SALE"]);
            table.enum('action_type', ["BANNER_PRODUCTS", 'CATEGORY', 'PRODUCT', 'URL', 'COURSE']);
            table.enum('status', ["active", "inactive"]).defaultTo('active');
            table.text("url");
            table.timestamp("start_date").nullable();
            table.timestamp("end_date").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
            table.timestamp("deletedAt").nullable();
          })
          .then(() => { }) // eslint-disable-line no-console
          .catch(() => { }); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating banners table", e)); // eslint-disable-line no-console

  return banners;
};
