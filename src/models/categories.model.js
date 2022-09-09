// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require('objection');

class categories extends Model {
  static setup(app) {
    this.app = app;
  }

  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', maxLength: 255 },
        parent_id: { type: 'integer' },
        path_icon: { type: ['string', 'null'] },
        path_icon2: { type: ['string', 'null'] },
        path_image: { type: ['string', 'null'] },
        slug: { type: ['string', 'null'] },
        position: { type: ['integer', 'null'] },
        status: { type: 'string', enum: ['active', 'inactive'] },
        banner_desktop_path: { type: 'string' },
        banner_mobile_path: { type: 'string' },
        deletedAt: { type: 'string', format: 'date-time' },
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
    categories.setup(app);
    const db = app.get('knex');

    db.schema
      .hasTable('categories')
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable('categories', (table) => {
              table.increments('id');
              table.string('name');
              table.integer('parent_id');
              table.text('path_icon');
              table.text('path_icon2');
              table.text('path_image');
              table.string('slug');
              table.text('banner_desktop_path');
              table.text('banner_mobile_path');
              table.integer('position');
              table.enum('status', ['active', 'inactive']).defaultTo('active');
              table.timestamp('deletedAt').nullable();
              table.timestamp('createdAt');
              table.timestamp('updatedAt');
            })
            .then(() => console.log('Created categories table')) // eslint-disable-line no-console
            .catch((e) => console.error('Error creating categories table', e)); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error('Error creating categories table', e)); // eslint-disable-line no-console
  }
  return categories;
};
