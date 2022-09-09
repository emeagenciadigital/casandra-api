const assert = require('assert');
const app = require('../../src/app');

describe('\'integrations-terceros\' service', () => {
  it('registered the service', () => {
    const service = app.service('integrations-terceros');

    assert.ok(service, 'Registered the service');
  });
});
