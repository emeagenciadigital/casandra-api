const assert = require('assert');
const app = require('../../src/app');

describe('\'terceros dms\' service', () => {
  it('registered the service', () => {
    const service = app.service('terceros-dms');

    assert.ok(service, 'Registered the service');
  });
});
