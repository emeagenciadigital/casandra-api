const assert = require('assert');
const app = require('../../src/app');

describe('\'integration-terceros-web-log\' service', () => {
  it('registered the service', () => {
    const service = app.service('integration-terceros-web-log');

    assert.ok(service, 'Registered the service');
  });
});
