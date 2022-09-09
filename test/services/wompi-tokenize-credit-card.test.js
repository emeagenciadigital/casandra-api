const assert = require('assert');
const app = require('../../src/app');

describe('\'wompi-tokenize-credit-card\' service', () => {
  it('registered the service', () => {
    const service = app.service('wompi-tokenize-credit-card');

    assert.ok(service, 'Registered the service');
  });
});
