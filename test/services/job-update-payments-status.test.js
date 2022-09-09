const assert = require('assert');
const app = require('../../src/app');

describe('\'job update payments status\' service', () => {
  it('registered the service', () => {
    const service = app.service('job-update-payments-status');

    assert.ok(service, 'Registered the service');
  });
});
