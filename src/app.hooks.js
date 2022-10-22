const { when, iff } = require("feathers-hooks-common");
const authorize = require("./hooks/abilities");
const authenticate = require("./hooks/authenticate");
const logger = require("./hooks/log");
const showErrors = require("./hooks/show-errors");
const { softDelete } = require("feathers-hooks-common");

const deleted = softDelete({
  // context is the normal hook context
  deletedQuery: async (context) => {
    if (context.service.getModel) {
      const field = `${context.service.getModel().tableName}.deletedAt`;
      return { [field]: null };
    }
  },
  removeData: async () => {
    return { deletedAt: new Date().toISOString() };
  },
});

const validEmailUserCreate = require("./hooks/valid-email-user-create");

const deprecatedDelete = () => (context) =>
  iff(context =>
    ![
      'contacts-directory',
      'contacts-directory-attributes',
      'contacts-directory-categories',
      'contacts-directory-media',
      'locations_cities',
      'locations_states',
      'work-offers',
    ].includes(context.path),
    deleted
  )(context)

module.exports = {
  before: {
    all: [
      when(
        (hook) =>
          hook.params.provider &&
          `/${hook.path}` !== hook.app.get("authentication").path,
        authenticate,
        authorize()
      ),
      logger(),
    ],
    find: [deprecatedDelete()],
    get: [deprecatedDelete()],
    create: [
      (context) => {
        delete context.data.deletedAt;
      },
      validEmailUserCreate(),
    ],
    update: [deprecatedDelete()],
    patch: [deprecatedDelete()],
    remove: [],
  },

  after: {
    all: [],
    find: [
    ],
    get: [
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [showErrors()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
