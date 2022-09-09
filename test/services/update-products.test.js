const assert = require('assert');
const app = require('../../src/app');

describe('\'update-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('update-products');

    assert.ok(service, 'Registered the service');
  });
});
