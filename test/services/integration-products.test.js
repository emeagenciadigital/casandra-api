const assert = require('assert');
const app = require('../../src/app');

describe('\'integration products\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-products');

    assert.ok(service, 'Registered the service');
  });
});
