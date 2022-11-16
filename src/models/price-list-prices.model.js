const { DataTypes } = require('sequelize')
const productsSequelizeModel = require('./products.sequelize.model')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const priceListPrices = sequelizeClient.define(
    'price_list_prices',
    {
      price_list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
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

  priceListPrices.associate = function (models) {
    priceListPrices.belongsTo(models.price_list, {
      foreignKey: 'price_list_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'price_list'
    })
    priceListPrices.belongsTo(productsSequelizeModel(app), {
      foreignKey: 'product_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'product'
    })
  }

  // priceListPrices.sync({ alter: true }).catch(err => console.log(err))

  return priceListPrices
}