// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class ordersDetails extends Model {
  static get tableName() {
    return "orders_details";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "order_id",
        "shipping_status",
        "type_product",
        "product_id",
        "unit_price_tax_excl",
        "quantity",
        "unit_price_tax_incl",
        "unit_price_tax",
        "total_price_tax_incl",
        "total_price_tax",
      ],

      properties: {
        order_id: { type: "integer" },
        shipping_status: {
          type: "string",
          enum: ["sent", "delivered", "pending shipping"],
        },
        quantity: { type: "integer" },
        product_id: { type: "integer" },
        unit_price_tax_excl: { type: "number" },
        unit_price_tax_incl: { type: "number" },
        unit_price_tax: { type: "number" },
        total_price_tax: { type: "number" },
        total_price_tax_incl: { type: "number" },
        sent: { type: "integer" },
        product_name: { type: "string" },
        product_image: { type: "string" },
        product_details_meta_data: { type: "string" },
        scheduled_delivery_date: { type: "string", format: "date" },
        
        discount_id: { type: 'integer' },
        meta_discount_name: { type: 'string' },
        meta_discount_code: { type: 'string' },
        meta_discount_value_percentage: { type: 'integer' },
        meta_discount_value_amount: { type: 'number' },
        discount_unit_amount: { type: 'number' },
        discount_total_amount: { type: 'number' },
        
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
    .hasTable("orders_details")
    .then((exists) => {
      if (!exists) {
        db.schema
          .createTable("orders_details", (table) => {
            table.increments("id");
            table
              .integer("order_id")
              .unsigned()
              .references("id")
              .inTable("orders")
              .index();
            table
              .integer("product_id")
              .unsigned()
              .references("id")
              .inTable("products")
              .index();
            table.integer("quantity");
            table.decimal("unit_price_tax_excl");
            table.decimal("unit_price_tax_incl");
            table.decimal("unit_price_tax");
            table.decimal("total_price_tax");
            table.decimal("total_price_tax_incl");
            table.integer("sent");
            table.string("product_name");
            table.string("product_main_image");
            table.text("product_details_meta_data");
            table.date("scheduled_delivery_date");
            table.timestamp("deletedAt").nullable();
            table.timestamp("createdAt");
            table.timestamp("updatedAt");
          })
          .then(() => console.log("Created orders_details table")) // eslint-disable-line no-console
          .catch((e) =>
            console.error("Error creating orders_details table", e)
          ); // eslint-disable-line no-console
      }
    })
    .catch((e) => console.error("Error creating orders_details table", e)); // eslint-disable-line no-console

  return ordersDetails;
};
