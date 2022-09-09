// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class DicountConditions extends Model {

  static get tableName() {
    return 'dicount_conditions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['discount_id', 'type'],

      properties: {
        discount_id: { type: 'integer' },
        type: {
          type: 'string',
          enum: ['category', 'new_product', 'product', 'all_products'],
        },
        category_id: { type: 'integer' },
        product_id: { type: 'integer' },
        new_product_days: { type: 'integer' }
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

  db.schema.hasTable('dicount_conditions').then(exists => {
    if (!exists) {
      db.schema.createTable('dicount_conditions', table => {
        table.increments('id');
        table.integer('discount_id')
          .unsigned()
          .references('id')
          .inTable('discounts')
          .index();
        table.enum('type', ['category', 'new_product', 'product', 'all_products']);
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
        table.integer('new_products_days').nullable();
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created dicount_conditions table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating dicount_conditions table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating dicount_conditions table', e)); // eslint-disable-line no-console

  return DicountConditions;
};
