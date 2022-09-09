const assert = require('assert');
const app = require('../../src/app');

describe('\'integrations-status\' service', () => {
  it('registered the service', () => {
    const service = app.service('integrations-status');

    assert.ok(service, 'Registered the service');
  });
});
