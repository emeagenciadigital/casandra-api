const registerBlogGuide = require("./hooks/register-blog-guide");
const removeAlgolia = require("./hooks/remove-algolia");
const updateAlgolia = require("./hooks/update-algolia");
const restricActiveBeforePatch = require("./hooks/restric-active-before-patch");
const removeSoftDelete = require("../../hooks/remove-softdelete");
const searchAdmin = require("./hooks/search-admin");
const { fastJoin } = require("feathers-hooks-common");

const resolves = {
  joins: {
    join: () => async (records, context) => {
      [records.blog_category] = await Promise.all([
        context.app
          .service("blogs-categories")
          .getModel()
          .query()
          .where({ id: records.blog_category_id, deletedAt: null })
          .then((it) => it[0]),
      ]);
    },
  },
};

module.exports = {
  before: {
    all: [],
    find: [searchAdmin()],
    get: [searchAdmin()],
    create: [registerBlogGuide()],
    update: [],
    patch: [restricActiveBeforePatch()],
    remove: [removeSoftDelete()],
  },

  after: {
    all: [],
    find: [fastJoin(resolves)],
    get: [fastJoin(resolves)],
    create: [],
    update: [],
    patch: [
      /* updateAlgolia() */
    ],
    remove: [
      /* removeAlgolia() */
    ],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
