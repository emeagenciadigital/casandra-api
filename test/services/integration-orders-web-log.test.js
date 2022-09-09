const assert = require('assert');
const app = require('../../src/app');

describe('\'integration orders web log\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-orders-web-log');

    assert.ok(service, 'Registered the service');
  });
});
