const assert = require('assert');
const app = require('../../src/app');

describe('\'blogs categories\' service', () => {
  it('registered the service', () => {
    const service = app.service('blogs-categories');

    assert.ok(service, 'Registered the service');
  });
});
