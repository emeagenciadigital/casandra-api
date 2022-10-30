const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const workOffersCategories = sequelizeClient.define(
    'work_offers_categories',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      status: {
        type: DataTypes.ENUM('inactive', 'active'),
        allowNull: false,
        defaultValue: 'inactive',
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

  // workOffersCategories.sync({ alter: true }).catch(err => console.log(err))

  return workOffersCategories
}