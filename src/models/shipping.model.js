// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class shipping extends Model {
  static get tableName() {
    return "shipping";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_id", "delivery_guy_user_id", "shipping_status_id"],

      properties: {
        order_id: { type: "integer" },
        private_notes: { type: "string" },
        delivery_guy_user_id: { type: "integer" },
        shipping_status: { type: "integer" },
        pending_payment: { type: "number" },
        payment_received: { type: "number" },
        fulfillment_company_id: { type: "integer" },
        fulfillment_company_meta_data: { type: "string" },
        fulfillment_company_service_code_description: { type: "string" },
        fulfillment_company_service_code: { type: "integer" },
        fulfillment_company_delivery_guide: { type: "string" },
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
    .hasTable("shipping")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("shipping", (table) => {
            table.increments("id");
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index();
            table
              .integer("delivery_guy_user_id")
              .unsigned()
              .references("id")
              .inTable("users")
              .index();
            table
              .integer("shipping_status_id")
              .unsigned()
              .references("id")
              .inTable("shipping_status")
              .index();
            table.string("delivery_number");
            table.double("payment_received").defaultTo(0);
            table.double("pending_payment").defaultTo(0);
            table.text("private_notes");
            table.integer("fulfillment_company_id");
            table.text("fulfillment_company_meta_data");
            table.string("fulfillment_company_service_code_description");
            table.text("fulfillment_company_delivery_guide");
            table.double("price");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created shipping table")) // eslint-disable-line no-console
          .catch((e) => console.error("Error creating shipping table", e)); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating shipping table", e)); // eslint-disable-line no-console

  return shipping;
};
