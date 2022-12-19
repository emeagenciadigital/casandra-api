const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userContactDirectory = sequelizeClient.define(
    'user_contact_directory',
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      contact_directory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meta_phone_number: {
        type: DataTypes.STRING,
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

  userContactDirectory.associate = function (models) {
    userContactDirectory.belongsTo(models.contacts_directory, {
      foreignKey: 'contact_directory_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'contact_directory'
    })

  }

  // userContactDirectory.sync({ alter: true }).catch(err => console.log(err))

  return userContactDirectory
}