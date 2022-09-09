// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class blogsCategories extends Model {
  static get tableName() {
    return "blogs_categories";
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
    .hasTable("blogs_categories")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("blogs_categories", (table) => {
            table.increments("id");
            table.string("name");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created blogs_categories table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating blogs_categories table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating blogs_categories table", e)); // eslint-disable-line no-console

  return blogsCategories;
};
