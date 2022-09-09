const assert = require('assert');
const app = require('../../src/app');

describe('\'eme-integration-status\' service', () => {
  it('registered the service', () => {
    const service = app.service('eme-integration-status');

    assert.ok(service, 'Registered the service');
  });
});
