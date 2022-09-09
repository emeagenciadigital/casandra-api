const assert = require('assert');
const app = require('../../src/app');

describe('\'discounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('discounts');

    assert.ok(service, 'Registered the service');
  });
});
