const assert = require('assert');
const app = require('../../src/app');

describe('\'features\' service', () => {
  it('registered the service', () => {
    const service = app.service('features');

    assert.ok(service, 'Registered the service');
  });
});
