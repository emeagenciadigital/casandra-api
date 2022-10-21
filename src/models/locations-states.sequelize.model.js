const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const locationsStates = sequelizeClient.define(
    'locations_states',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      integration_id: {
        type: DataTypes.STRING,
      },
      dane_code: {
        type: DataTypes.STRING,
      },
      region: {
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

  locationsStates.associate = function (models) {
    locationsStates.hasMany(models.locations_cities, {
      foreignKey: 'state_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'cities'
    })
  }

  // locationsStates.sync({ alter: true }).catch(err => console.log(err))

  return locationsStates
}
