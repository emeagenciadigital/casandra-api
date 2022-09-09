// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class productsMedia extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return "products_media";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["product_id", "type"],

      properties: {
        product_id: { type: "integer" },
        type: { type: "string", enum: ["image", "url_youtube"] },
        path: { type: "string" },
        embed_code: { type: "string" },
        url_youtube: { type: "string" },
        priority: { type: "integer" },
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
    productsMedia.setup(app);
    const db = app.get("knex");

    db.schema
      .hasTable("products_media")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("products_media", (table) => {
              table.increments("id");
              table
                .integer("product_id")
                .unsigned()
                .references("id")
                .inTable("products")
                .index()
                .nullable();
              table.enum("type", ["image", "url_youtube"]);
              table.text("path");
              table.text("url_youtube");
              table.integer("priority");
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created products_media table")) // eslint-disable-line no-console
            .catch((e) =>
              console.error("Error creating products_media table", e)
            ); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating products_media table", e)); // eslint-disable-line no-console
  }
  return productsMedia;
};
