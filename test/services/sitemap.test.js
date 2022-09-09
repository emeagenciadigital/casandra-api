const assert = require('assert');
const app = require('../../src/app');

describe('\'sitemap\' service', () => {
  it('registered the service', () => {
    const service = app.service('sitemap');

    assert.ok(service, 'Registered the service');
  });
});
