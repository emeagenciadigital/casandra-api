const assert = require('assert');
const app = require('../../src/app');

describe('\'integration productos web log\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-productos-web-log');

    assert.ok(service, 'Registered the service');
  });
});
