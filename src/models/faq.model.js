// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class faq extends Model {
  static get tableName() {
    return "faq";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["question"],

      properties: {
        question: { type: "string" },
        answer: { type: "string" },
        status: { type: "string" },
        position: { type: "integer" },
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
    .hasTable("faq")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("faq", (table) => {
            table.increments("id");
            table.string("question");
            table.text("answer");
            table.enum("status", ["active", "inactive"]);
            table.integer("position").defaultTo(0);
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created faq table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating faq table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating faq table", e)); // eslint-disable-line no-console

  return faq;
};
