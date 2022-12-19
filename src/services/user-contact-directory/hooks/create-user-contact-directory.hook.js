const { NotAuthenticated, NotAcceptable, NotFound } = require("@feathersjs/errors")
const { getItems, replaceItems } = require("feathers-hooks-common")

module.exports = () => async (context) => {
  const record = getItems(context)
  const user = context.params.user

  if (!user) throw new NotAuthenticated('Debes iniciar sesión.')
  if (!record.contact_directory_id) throw new NotAcceptable('Debes enviar el id del contacto.')

  const contact = await context.app.service('contacts-directory')
    .getModel()
    .findByPk(record.contact_directory_id)

  if (!contact) throw new NotFound('No se encontró el contacto.')

  record.user_id = user.id
  record.meta_phone_number = contact.whatsapp_phone

  replaceItems(context, record)

  return context
}