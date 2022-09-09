const assert = require('assert');
const app = require('../../src/app');

describe('\'v-cartera-edades\' service', () => {
  it('registered the service', () => {
    const service = app.service('v-cartera-edades');

    assert.ok(service, 'Registered the service');
  });
});
