const assert = require('assert');
const app = require('../../src/app');

describe('\'integration price list web log\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-price-list-web-log');

    assert.ok(service, 'Registered the service');
  });
});
