// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class Stores extends Model {

  static get tableName() {
    return 'stores';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['location_city_id', 'name', 'phone', 'address'],

      properties: {
        location_city_id: { type: 'integer' },
        name: { type: 'string' },
        phone: { type: 'string' },
        phone2: { type: 'string' },
        email: {type: 'string'},
        schedule: {type: 'string'},
        address: { type: 'string' },
        deletedAt: { type: 'string', format: 'date-time'},
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

  db.schema.hasTable('stores').then(exists => {
    if (!exists) {
      db.schema.createTable('stores', table => {
        table.increments('id');
        table
          .integer('location_city_id')
          .unsigned()
          .references('id')
          .inTable('location_cities')
          .index();
        table.string('name');
        table.string('phone');
        table.string('phone2');
        table.string('email');
        table.string('schedule');
        table.string('address');
        table.string('deletedAt').nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created stores table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating stores table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating stores table', e)); // eslint-disable-line no-console

  return Stores;
};
