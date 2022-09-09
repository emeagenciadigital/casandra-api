const assert = require('assert');
const app = require('../../src/app');

describe('\'fulfillment matrix\' service', () => {
  it('registered the service', () => {
    const service = app.service('fulfillment-matrix');

    assert.ok(service, 'Registered the service');
  });
});
