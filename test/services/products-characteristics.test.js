const assert = require('assert');
const app = require('../../src/app');

describe('\'products characteristics\' service', () => {
  it('registered the service', () => {
    const service = app.service('products-characteristics');

    assert.ok(service, 'Registered the service');
  });
});
