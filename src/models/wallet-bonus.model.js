const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const walletBonus = sequelizeClient.define(
    'wallet_bonus',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'active',
          'inactive',
        ),
        allowNull: false,
        defaultValue: 'inactive',
      },
      quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      expire_days: {
        type: DataTypes.INTEGER,
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


  // walletBonus.sync({ alter: true }).catch(err => console.log(err))

  return walletBonus
}