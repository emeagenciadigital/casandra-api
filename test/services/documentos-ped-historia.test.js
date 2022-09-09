const assert = require('assert');
const app = require('../../src/app');

describe('\'documentos-ped-historia\' service', () => {
  it('registered the service', () => {
    const service = app.service('documentos-ped-historia');

    assert.ok(service, 'Registered the service');
  });
});
