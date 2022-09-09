const assert = require('assert');
const app = require('../../src/app');

describe('\'price list\' service', () => {
  it('registered the service', () => {
    const service = app.service('price-list');

    assert.ok(service, 'Registered the service');
  });
});
