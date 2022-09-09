const assert = require('assert');
const app = require('../../src/app');

describe('\'integations-terceros\' service', () => {
  it('registered the service', () => {
    const service = app.service('integations-terceros');

    assert.ok(service, 'Registered the service');
  });
});
