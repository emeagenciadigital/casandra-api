// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class Discounts extends Model {

  static get tableName() {
    return 'discounts';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'name',
        'code',
        'quantity',
        'uses_by_user',
        'date_start',
        'date_end'
      ],

      properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        quantity: { type: 'number' },
        uses_by_user: { type: 'number', default: 1 },
        applies_to: {
          type: 'string',
          enum: ['line_item', 'order']
        },
        value_percentage: { type: ['number', 'null'] },
        value_amount: { type: 'number' },
        date_start: { type: 'date-time' },
        date_end: { type: 'date-time' },
        priority: { type: 'number' },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          default: 'active'
        },
        order_min_amount: { type: 'number', default: 0, }
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

  db.schema.hasTable('discounts').then(exists => {
    if (!exists) {
      db.schema.createTable('discounts', table => {
        table.increments('id');
        table.string('name');
        table.string('code');
        table.integer('quantity');
        table.integer('uses_by_user').defaultTo(1);
        table.enum('applies_to', ['line_item', 'order']);
        table.integer('value_percentage').nullable();
        table.double('value_amount').nullable();
        table.timestamp('date_start');
        table.timestamp('date_end');
        table.integer('priority');
        table.enum('status', ['active', 'inactive']).defaultTo('active');
        table.double('order_min_amount').defaultTo(0);
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created discounts table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating discounts table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating discounts table', e)); // eslint-disable-line no-console

  return Discounts;
};
