const assert = require('assert');
const app = require('../../src/app');

describe('\'wompi-pse-banks\' service', () => {
  it('registered the service', () => {
    const service = app.service('wompi-pse-banks');

    assert.ok(service, 'Registered the service');
  });
});
