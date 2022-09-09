const assert = require('assert');
const app = require('../../src/app');

describe('\'characteristics\' service', () => {
  it('registered the service', () => {
    const service = app.service('characteristics');

    assert.ok(service, 'Registered the service');
  });
});
