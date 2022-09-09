// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class PurchaseOrders extends Model {
  static get tableName() {
    return "purchase_orders";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],
      properties: {
        status: {
          type: "string",
          enum: ["Pendiente", "Procesando", "Procesado", "Rechazada"],
        },
        user_id: { type: "integer" },
        company_id: { type: "integer" },
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
    .hasTable("purchase_orders")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("purchase_orders", (table) => {
            table.increments("id");
            table
              .enum("status", [
                "Pendiente",
                "Procesando",
                "Procesado",
                "Rechazada",
              ])
              .defaultTo("Pendiente");
            table.text("path_file");
            table
              .integer("user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .integer("company_id")
              .unsigned()
              .references("id")
              .inTable("companies")
              .index();
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created purchase_orders table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating purchase_orders table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating purchase_orders table", e)); // eslint-disable-line no-console

  return PurchaseOrders;
};
