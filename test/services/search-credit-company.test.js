const assert = require('assert');
const app = require('../../src/app');

describe('\'search credit company\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-credit-company');

    assert.ok(service, 'Registered the service');
  });
});
