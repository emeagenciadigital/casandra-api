const { getItems, replaceItems } = require("feathers-hooks-common")
const { default: slugify } = require("slugify")

module.exports = () => async (context) => {
  const record = getItems(context)

  if (record.name && !record.slug) {
    const slugName = slugify(`${record.id} ${record.name.toLowerCase()}`, {
      remove: /[*+~.()/'"!:@]/g,
    })
    await context.app
      .service('courses')
      .getModel()
      .update(
        { slug: slugName },
        { where: { id: record.id } }
      )

    record.slug = slugName
  }

  replaceItems(context, record)

  return context
}