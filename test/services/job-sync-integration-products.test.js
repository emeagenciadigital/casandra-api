const assert = require('assert');
const app = require('../../src/app');

describe('\'job sync integration products\' service', () => {
  it('registered the service', () => {
    const service = app.service('job-sync-integration-products');

    assert.ok(service, 'Registered the service');
  });
});
