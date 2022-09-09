const assert = require('assert');
const app = require('../../src/app');

describe('\'create-process-payment\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-process-payment');

    assert.ok(service, 'Registered the service');
  });
});
