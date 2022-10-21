const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const contactsDirectory = sequelizeClient.define(
    'contacts_directory',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT(1, 1),
      },
      short_description: {
        type: DataTypes.TEXT('medium'),
      },
      description: {
        type: DataTypes.TEXT,
      },
      whatsapp_phone: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      path_cover: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
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

  contactsDirectory.associate = function (models) {
    contactsDirectory.belongsTo(models.locations_cities, {
      foreignKey: 'city_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'city'
    })
    contactsDirectory.belongsTo(models.contacts_directory_categories, {
      foreignKey: 'category_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'category'
    })
    contactsDirectory.hasMany(models.contacts_directory_attributes, {
      foreignKey: 'contact_directory_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'attributes'
    })
    contactsDirectory.hasMany(models.contacts_directory_media, {
      foreignKey: 'contact_directory_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'media'
    })
  }

  // contactsDirectory.sync({ alter: true }).catch(err => console.log(err))

  return contactsDirectory
}