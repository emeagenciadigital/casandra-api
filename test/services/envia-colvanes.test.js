const assert = require('assert');
const app = require('../../src/app');

describe('\'envia-colvanes\' service', () => {
  it('registered the service', () => {
    const service = app.service('envia-colvanes');

    assert.ok(service, 'Registered the service');
  });
});
