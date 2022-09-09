// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class LabelsConditions extends Model {

  static get tableName() {
    return 'labels_conditions';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'integer' },
        label_id: { type: 'integer' },
        type: {
          type: 'string',
          enum: [
            'discount_percentage',
            'categories',
            'new_product',
            'product',
            'all_products',
          ]
        },
        discount_percentage_is: { type: 'number' },
        category_id: { type: 'integer' },
        product_id: { type: 'integer' },
        new_product_days: { type: 'integer' },
        deletedAt: { type: 'string', format: 'date-time' }
      }
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
  const db = app.get('knex');

  db.schema.hasTable('labels_conditions').then(exists => {
    if (!exists) {
      db.schema.createTable('labels_conditions', table => {
        table.increments('id').primary();
        table.integer('label_id')
          .nullable()
          .unsigned()
          .references('id')
          .inTable('labels')
          .index();
        table.enum('type', ['discount_percentage', 'categories', 'new_product', 'product', 'all_products']);
        table.float('discount_percentage_is');
        table.integer('category_id')
          .nullable()
          .unsigned()
          .references('id')
          .inTable('categories')
          .index();
        table.integer('product_id')
          .nullable()
          .unsigned()
          .references('id')
          .inTable('products')
          .index();
        table.integer('new_product_days').nullable();
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created labels_conditions table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating labels_conditions table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating labels_conditions table', e)); // eslint-disable-line no-console

  return LabelsConditions;
};
