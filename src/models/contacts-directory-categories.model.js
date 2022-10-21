const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const contactsDirectoryCategories = sequelizeClient.define(
    'contacts_directory_categories',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      }
    }
  )

  // contactsDirectoryCategories.sync({ alter: true }).catch(err => console.log(err))

  return contactsDirectoryCategories
}