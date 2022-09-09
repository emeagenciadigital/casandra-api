// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class blogs extends Model {
  static get tableName() {
    return "blogs";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "status", "blog_category_id"],

      properties: {
        title: { type: "string", maxLength: 255 },
        description: { type: "string" },
        image_cover: { type: "string" },
        shared_number: { type: "integer" },
        status: { type: "string", enum: ["active", "inactive"] },
        short_description: { type: "string", maxLength: 255 },
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
  const db = app.get("knex");

  db.schema
    .hasTable("blogs")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("blogs", (table) => {
            table.increments("id");
            table.string("title");
            table
              .integer("blog_category_id")
              .unsigned()
              .references("id")
              .inTable("blogs_categories")
              .index();
            table.text("description");
            table.text("image_cover");
            table.integer("shared_number");
            table.enum("status", ["active", "inactive"]).defaultTo("inactive");
            table.integer("priority");
            table.string("short_description");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created blogs table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating blogs table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating blogs table", e)); // eslint-disable-line no-console

  return blogs;
};
