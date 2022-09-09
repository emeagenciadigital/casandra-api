const assert = require('assert');
const app = require('../../src/app');

describe('\'fulfillment company\' service', () => {
  it('registered the service', () => {
    const service = app.service('fulfillment-company');

    assert.ok(service, 'Registered the service');
  });
});
