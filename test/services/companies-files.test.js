const assert = require('assert');
const app = require('../../src/app');

describe('\'companies files\' service', () => {
  it('registered the service', () => {
    const service = app.service('companies-files');

    assert.ok(service, 'Registered the service');
  });
});
