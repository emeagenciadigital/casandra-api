const assert = require('assert');
const app = require('../../src/app');

describe('\'job integration products log\' service', () => {
  it('registered the service', () => {
    const service = app.service('job-integration-products-log');

    assert.ok(service, 'Registered the service');
  });
});
