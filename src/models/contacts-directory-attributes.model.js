const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const contactsDirectoryAttributes = sequelizeClient.define(
    'contacts_directory_attributes',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING
      },
      contact_directory_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
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

  contactsDirectoryAttributes.associate = function (models) {
    contactsDirectoryAttributes.belongsTo(models.contacts_directory, {
      foreignKey: 'contact_directory_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'contact_directory'
    })
  }

  // contactsDirectoryAttributes.sync({ alter: true }).catch(err => console.log(err))

  return contactsDirectoryAttributes
}