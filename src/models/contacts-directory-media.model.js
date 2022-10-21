const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const contactsDirectoryMedia = sequelizeClient.define(
    'contacts_directory_media',
    {
      contact_directory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
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

  contactsDirectoryMedia.associate = function (models) {
    contactsDirectoryMedia.belongsTo(models.contacts_directory, {
      foreignKey: 'contact_directory_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'contact_directory'
    })
  }

  // contactsDirectoryMedia.sync({ alter: true }).catch(err => console.log(err))

  return contactsDirectoryMedia
}