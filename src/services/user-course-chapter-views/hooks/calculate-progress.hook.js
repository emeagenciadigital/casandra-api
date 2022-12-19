const { getItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.status !== 'viewed') return context

  const [chaptersViews, courseChapters] = await Promise.all([
    context.app.service('user-course-chapter-views')
      .getModel()
      .count('id', {
        where: {
          user_course_id: record.user_course_id
        }
      }),
    context.app.service('course-chapters')
      .getModel()
      .count('id', {
        where: {
          course_id: record.meta_course_id
        }
      })
  ])

  const progress = (chaptersViews / courseChapters * 100).toFixed(0)

  await context.app.service('user-courses')
    .getModel()
    .update({ progress: `${progress}%` }, { where: { id: record.user_course_id } })

  return context
}