const assert = require('assert');
const app = require('../../src/app');

describe('\'job sync integration orders\' service', () => {
  it('registered the service', () => {
    const service = app.service('job-sync-integration-orders');

    assert.ok(service, 'Registered the service');
  });
});
