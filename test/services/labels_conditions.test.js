const assert = require('assert');
const app = require('../../src/app');

describe('\'labels_conditions\' service', () => {
  it('registered the service', () => {
    const service = app.service('labels-conditions');

    assert.ok(service, 'Registered the service');
  });
});
