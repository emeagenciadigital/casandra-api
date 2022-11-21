// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class expressProducts extends Model {
  static get tableName() {
    return "products";
  }

  static get relationMappings() {
    const expressCategoryModel = require("./categories.model")();
    const branModel = require("./brands.model")();
    const taxModel = require("./tax-rule.model")();
    const mediaModel = require("./products-media.model")();

    return {
      category: {
        relation: Model.HasOneRelation,
        modelClass: expressCategoryModel,
        join: {
          from: "products.category_id",
          to: "categories.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
      category_2: {
        relation: Model.HasOneRelation,
        modelClass: expressCategoryModel,
        join: {
          from: 'products.category_id_2',
          to: 'categories.id'
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null })
          return buildQuery
        }
      },
      category_3: {
        relation: Model.HasOneRelation,
        modelClass: expressCategoryModel,
        join: {
          from: 'products.category_id_3',
          to: 'categories.id'
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null })
          return buildQuery
        }
      },
      brand: {
        relation: Model.HasOneRelation,
        modelClass: branModel,
        join: {
          from: "products.brand_id",
          to: "brands.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
      tax: {
        relation: Model.HasOneRelation,
        modelClass: taxModel,
        join: {
          from: "products.tax_rule_id",
          to: "tax_rule.id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
      media: {
        relation: Model.HasManyRelation,
        modelClass: mediaModel,
        join: {
          from: "products.id",
          to: "products_media.product_id",
        },
        filter: (buildQuery) => {
          buildQuery.where({ deletedAt: null });
          return buildQuery;
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",

      properties: {
        name: { type: "string", maxlength: 255 },
        category_id: { type: "integer" },
        category_id_2: { type: "integer" },
        category_id_3: { type: "integer" },
        brand_id: { type: "integer" },
        discount_price: { type: ["number", "null"] },
        discount_price_whit_tax: { type: ["number", "null"] },
        price: { type: "number" },
        price_with_tax: { type: "number" },
        unit_measure: { type: "string" },
        quantity_per_unit_measure: { type: "integer" },
        description: { type: "string" },
        status: { type: "string", enum: ["active", "inactive", "null"] },
        category_path_ids: { type: "string" },
        tax_rule_id: { type: "integer" },
        quantity: { type: "integer" },
        code: { type: "string", maxlength: 255 },
        integration_id: { type: "string", maxlength: 255 },
        integration_hash: { type: "text" },
        images: { type: "string", enum: ["true", "false"] },
        course: { type: "string", enum: ["true", "false"] },
        slug: { type: ["string", "null"] },
        weight: { type: ["number", "null"] },
        heigh: { type: ["number", "null"] },
        width: { type: ["number", "null"] },
        long: { type: ["number", "null"] },
        position_more_sales: { type: ["number", "null"] },
        user_guide_composition: { type: ['string', 'null'] },
        user_guide_care: { type: ['string', 'null'] }
        // label_id: { type: ['integer', null] },
        // label_name: { type: 'string' },
        // label_position: { type: 'string' },
        // label_start_date: { type: 'string', format: 'date-time' },
        // label_end_date: { type: 'string', format: 'date-time' },
        // label_path: { type: 'string' }
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
    const db = app.get("knex");

    db.schema
      .hasTable("products")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("products", (table) => {
              table.increments("id");
              table.string("name", 255);
              table
                .integer("category_id")
                .unsigned()
                .references("id")
                .inTable("categories")
                .index();
              table
                .integer("category_id_2")
                .unsigned()
                .references("id")
                .inTable("categories")
                .index();
              table
                .integer("category_id_3")
                .unsigned()
                .references("id")
                .inTable("categories")
                .index();
              table
                .integer("brand_id")
                .unsigned()
                .references("id")
                .inTable("brands")
                .index();
              table.float("discount_price");
              table.float("discount_price_whit_tax");
              table.float("price");
              table.float("price_with_tax");
              table.string("unit_measure");
              table.integer("quantity_per_unit_measure");
              table.text("description");
              table
                .enum("status", ["active", "inactive"])
                .defaultTo("inactive");
              table.string("category_path_ids");
              table
                .integer("tax_rule_id")
                .unsigned()
                .references("id")
                .inTable("tax_rule")
                .index();
              table.integer("quantity");
              table.string("code").unique();
              table.enum("images", ["true", "false"]).defaultTo("false");
              table.enum("course", ["true", "false"]).defaultTo("false");
              table.string("integration_id").unique();
              table.text("integration_hash");
              table.string("slug");
              table.double("weight");
              table.double("heigh");
              table.double("width");
              table.double("long");
              table.integer("position_more_sales");
              table.boolean('is_ead').nullable()
              table.integer('label_id')
                .nullable()
                .unsigned()
                .references('id')
                .inTable("labels")
                .index();
              table.string('label_name').nullable();
              table.string('label_position').nullable();
              table.timestamp('label_start_date').nullable();
              table.timestamp('label_end_date').nullable();
              table.string('label_path').nullable();
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
              table.text('user_guide_composition', 'longtext').nullable();
              table.text('user_guide_care', 'longtext').nullable();
            })
            .then(() => console.log("Created products table")) // eslint-disable-line no-console
            .catch((e) => console.error("Error creating products table", e)); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating products table", e)); // eslint-disable-line no-console
  }
  return expressProducts;
};
