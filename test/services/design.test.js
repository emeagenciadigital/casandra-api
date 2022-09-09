const assert = require('assert');
const app = require('../../src/app');

describe('\'design\' service', () => {
  it('registered the service', () => {
    const service = app.service('design');

    assert.ok(service, 'Registered the service');
  });
});
