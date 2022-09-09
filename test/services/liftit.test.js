const assert = require('assert');
const app = require('../../src/app');

describe('\'liftit\' service', () => {
  it('registered the service', () => {
    const service = app.service('liftit');

    assert.ok(service, 'Registered the service');
  });
});
