const assert = require('assert');
const app = require('../../src/app');

describe('\'dicount_conditions\' service', () => {
  it('registered the service', () => {
    const service = app.service('dicount-conditions');

    assert.ok(service, 'Registered the service');
  });
});
