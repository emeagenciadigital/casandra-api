const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const addresses = sequelizeClient.define(
    'addresses',
    {
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING,
      },
      state_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      state_name: {
        type: DataTypes.STRING,
      },
      lat: {
        type: DataTypes.FLOAT,
      },
      lng: {
        type: DataTypes.FLOAT,
      },
      details: {
        type: DataTypes.STRING,
      },
      main: {
        type: DataTypes.ENUM('true', 'false'),
        allowNull: false,
        defaultValue: 'true',
      },
      postal_code: {
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

  addresses.associate = function (models) {
    addresses.belongsTo(models.locations_states, {
      foreignKey: 'state_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'state'
    })
    addresses.belongsTo(models.locations_cities, {
      foreignKey: 'city_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'city'
    })
  }

  // addresses.sync({ alter: true }).catch(err => console.log(err))

  return addresses
}