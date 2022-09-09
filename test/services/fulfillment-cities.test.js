const assert = require('assert');
const app = require('../../src/app');

describe('\'fulfillment cities\' service', () => {
  it('registered the service', () => {
    const service = app.service('fulfillment-cities');

    assert.ok(service, 'Registered the service');
  });
});
