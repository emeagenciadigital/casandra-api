const assert = require('assert');
const app = require('../../src/app');

describe('\'products features\' service', () => {
  it('registered the service', () => {
    const service = app.service('products-features');

    assert.ok(service, 'Registered the service');
  });
});
