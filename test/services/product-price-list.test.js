const assert = require('assert');
const app = require('../../src/app');

describe('\'product price list\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-price-list');

    assert.ok(service, 'Registered the service');
  });
});
