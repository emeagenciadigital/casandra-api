const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const priceList = sequelizeClient.define(
    'price_list',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      start_at: {
        type: DataTypes.DATE,
      },
      ends_at: {
        type: DataTypes.DATE,
      },

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

  priceList.associate = function (models) {
    priceList.hasMany(models.price_list_customer_groups, {
      foreignKey: 'price_list_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'customer_groups'
    })
    priceList.hasMany(models.price_list_prices, {
      foreignKey: 'price_list_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'prices'
    })
  }

  // priceList.sync({ alter: true }).catch(err => console.log(err))

  return priceList
}