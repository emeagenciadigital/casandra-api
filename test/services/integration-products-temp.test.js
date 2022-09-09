const assert = require('assert');
const app = require('../../src/app');

describe('\'integration products temp\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-products-temp');

    assert.ok(service, 'Registered the service');
  });
});
