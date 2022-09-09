const assert = require('assert');
const app = require('../../src/app');

describe('\'wompi-generate-merchant\' service', () => {
  it('registered the service', () => {
    const service = app.service('wompi-generate-merchant');

    assert.ok(service, 'Registered the service');
  });
});
