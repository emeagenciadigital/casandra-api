const { DataTypes } = require('sequelize')
const priceListPricesModel = require('./price-list-prices.model')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const products = sequelizeClient.define(
    'products',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      price_with_tax: {
        type: DataTypes.DOUBLE,
      },
      discount_price: {
        type: DataTypes.DOUBLE,
      },
      discount_price_whit_tax: {
        type: DataTypes.DOUBLE,
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

  products.associate = function () {
    products.hasMany(priceListPricesModel(app), {
      foreignKey: 'product_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'price_list'
    })
  }

  return products
}