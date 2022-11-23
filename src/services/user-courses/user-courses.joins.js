const { fastJoin } = require("feathers-hooks-common");

exports.withCoursesAndChaptersViews = () => fastJoin({
  joins: {
    join: () => async (record, context) => {
      [
        record.course,
        record.chapter_views
      ] = await Promise.all([
        context.app.service('courses')
          .getModel()
          .findByPk(record.course_id),
        context.app.service('user-course-chapter-views')
          .getModel()
          .findAll({
            where: { user_course_id: record.id }
          })
      ])
    }
  }
})