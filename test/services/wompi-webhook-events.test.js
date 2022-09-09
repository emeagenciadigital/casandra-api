const assert = require('assert');
const app = require('../../src/app');

describe('\'wompi-webhook-events\' service', () => {
  it('registered the service', () => {
    const service = app.service('wompi-webhook-events');

    assert.ok(service, 'Registered the service');
  });
});
