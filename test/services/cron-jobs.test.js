const assert = require('assert');
const app = require('../../src/app');

describe('\'cron jobs\' service', () => {
  it('registered the service', () => {
    const service = app.service('cron-jobs');

    assert.ok(service, 'Registered the service');
  });
});
