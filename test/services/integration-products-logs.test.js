const assert = require('assert');
const app = require('../../src/app');

describe('\'integration products logs\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-products-logs');

    assert.ok(service, 'Registered the service');
  });
});
