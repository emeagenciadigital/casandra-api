const { getItems } = require("feathers-hooks-common")

const withAllData = (record) => async (context) => {
  const app = context.app

    ;[
      record.category,
      record.sections,
      record.benefits
    ] = await Promise.all([
      app.service('courses-categories')
        .getModel()
        .findByPk(record.category_id),
      app.service('course-sections')
        .getModel()
        .findAll({
          include: [
            {
              association: 'chapters',
              attributes: { exclude: ['path_video'] }
            }
          ],
          where: {
            course_id: record.id
          }
        }),
      app.service('course-benefits')
        .getModel()
        .findAll({
          where: {
            course_id: record.id
          }
        })
    ])

  return record
}


const updateOrCreateDocument = (record) => (context) => {
  if (record.status === 'active') {
    context.app.service('meilisearch').create({ index: 'courses', records: record })
  } else {
    context.app.service('meilisearch').remove(null, { query: { index: 'courses', records: record.id } })
      .then(res => console.log(res))
  }

}

module.exports = () => async (context) => {
  const record = { ...getItems(context) }

  switch (context.method) {
    case 'create':
    case 'patch':
      updateOrCreateDocument(
        await withAllData(record)(context)
      )(context)
      break
    case 'remove':
      context.app.service('meilisearch').remove(null, { query: { index: 'courses', records: record.id } })
      break
  }

  return context
}