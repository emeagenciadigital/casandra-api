const assert = require('assert');
const app = require('../../src/app');

describe('\'user products views\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-products-views');

    assert.ok(service, 'Registered the service');
  });
});
