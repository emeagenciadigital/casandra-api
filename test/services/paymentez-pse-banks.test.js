const assert = require('assert');
const app = require('../../src/app');

describe('\'paymentez-pse-banks\' service', () => {
  it('registered the service', () => {
    const service = app.service('paymentez-pse-banks');

    assert.ok(service, 'Registered the service');
  });
});
