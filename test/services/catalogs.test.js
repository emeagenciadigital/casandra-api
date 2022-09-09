const assert = require('assert');
const app = require('../../src/app');

describe('\'catalogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('catalogs');

    assert.ok(service, 'Registered the service');
  });
});
