const assert = require('assert');
const app = require('../../src/app');

describe('\'custom-payments\' service', () => {
  it('registered the service', () => {
    const service = app.service('custom-payments');

    assert.ok(service, 'Registered the service');
  });
});
