// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class Labels extends Model {

  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        position: {
          type: 'string',
          enum: [
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]
        },
        path: { type: 'string' },
        date_start: { type: 'string', format: 'date-time' },
        date_end: { type: 'string', format: 'date-time' },
        priority: { type: 'integer' },
        status: {
          type: 'string',
          enum: [
            'active',
            'inactive'
          ]
        },
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

  db.schema.hasTable('labels').then(exists => {
    if (!exists) {
      db.schema.createTable('labels', table => {
        table.increments('id').primary();
        table.string('name');
        table.enum('position', ['top-left', 'top-right', 'bottom-left', 'bottom-right']);
        table.string('path');
        table.timestamp('date_start');
        table.timestamp('date_end');
        table.integer('priority');
        table.enum('status', ['active', 'inactive']).defaultTo('active');
        table.timestamp('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created labels table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating labels table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating labels table', e)); // eslint-disable-line no-console

  return Labels;
};
