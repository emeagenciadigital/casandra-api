const assert = require('assert');
const app = require('../../src/app');

describe('\'fulfillment-cost\' service', () => {
  it('registered the service', () => {
    const service = app.service('fulfillment-cost');

    assert.ok(service, 'Registered the service');
  });
});
