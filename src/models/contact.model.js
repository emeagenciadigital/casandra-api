// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class contact extends Model {
  static get tableName() {
    return "contact";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["full_name", "email", "subject", "message"],

      properties: {
        full_name: { type: "string" },
        email: { type: "string" },
        subject: { type: "string" },
        message: { type: "string" },
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
    .hasTable("contact")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("contact", (table) => {
            table.increments("id");
            table.string("full_name");
            table.string("email");
            table.string("user_id");
            table.string("subject");
            table.string("message");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created contact table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating contact table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating contact table", e)); // eslint-disable-line no-console

  return contact;
};
