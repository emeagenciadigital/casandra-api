const assert = require('assert');
const app = require('../../src/app');

describe('\'payment confirmation paymentez\' service', () => {
  it('registered the service', () => {
    const service = app.service('payment-confirmation-paymentez');

    assert.ok(service, 'Registered the service');
  });
});
