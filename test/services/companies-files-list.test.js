const assert = require('assert');
const app = require('../../src/app');

describe('\'companies files list\' service', () => {
  it('registered the service', () => {
    const service = app.service('companies-files-list');

    assert.ok(service, 'Registered the service');
  });
});
