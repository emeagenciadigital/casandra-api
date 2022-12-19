const { NotAcceptable, NotFound } = require("@feathersjs/errors")
const { getItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)

  if (
    [
      'user_course_id',
      'chapter_id',
      'status'
    ].some(it => !Object.keys(record).includes(it))
  ) throw new NotAcceptable('Body no match.')

  if (!['watching', 'viewed'].includes(record.status)) throw new NotAcceptable('field status not valid.')

  const [userCourse, chapter] = await Promise.all([
    context.app.service('user-courses')
      .getModel()
      .findByPk(record.user_course_id),
    context.app.service('course-chapters')
      .getModel()
      .findByPk(record.chapter_id)
  ])

  if (!userCourse) throw new NotFound('User course not found')
  if (!chapter) throw new NotFound('Chapter not found')

  record.meta_course_id = chapter.course_id
  record.time = 0

  return context
}