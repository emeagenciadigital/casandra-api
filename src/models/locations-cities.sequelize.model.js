const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const locationsCities = sequelizeClient.define(
    'locations_cities',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      integration_id: {
        type: DataTypes.STRING,
      },
      state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dane_code: {
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

  locationsCities.associate = function (models) {
    locationsCities.belongsTo(models.locations_states, {
      foreignKey: 'state_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'state'
    })
  }

  // locationsCities.sync({ alter: true }).catch(err => console.log(err))

  return locationsCities
}
