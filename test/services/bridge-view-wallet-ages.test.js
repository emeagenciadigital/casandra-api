const assert = require('assert');
const app = require('../../src/app');

describe('\'bridge view wallet ages\' service', () => {
  it('registered the service', () => {
    const service = app.service('bridge-view-wallet-ages');

    assert.ok(service, 'Registered the service');
  });
});
