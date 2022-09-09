const assert = require('assert');
const app = require('../../src/app');

describe('\'documentos-ped\' service', () => {
  it('registered the service', () => {
    const service = app.service('documentos-ped');

    assert.ok(service, 'Registered the service');
  });
});
