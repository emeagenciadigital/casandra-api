const assert = require('assert');
const app = require('../../src/app');

describe('\'integration status\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-status');

    assert.ok(service, 'Registered the service');
  });
});
