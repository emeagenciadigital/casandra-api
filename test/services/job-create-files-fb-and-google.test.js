const assert = require('assert');
const app = require('../../src/app');

describe('\'job-create-files-fb-and-google\' service', () => {
  it('registered the service', () => {
    const service = app.service('job-create-files-fb-and-google');

    assert.ok(service, 'Registered the service');
  });
});
