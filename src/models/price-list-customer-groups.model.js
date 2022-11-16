const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const priceListCustomerGroups = sequelizeClient.define(
    'price_list_customer_groups',
    {
      price_list_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      customer_group_id: {
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

  priceListCustomerGroups.associate = function (models) {
    priceListCustomerGroups.belongsTo(models.price_list, {
      foreignKey: 'price_list_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'price_list',
    })
    priceListCustomerGroups.belongsTo(models.customer_group, {
      foreignKey: 'customer_group_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'customer_group',
    })
  }

  // priceListCustomerGroups.sync({ alter: true }).catch(err => console.log(err))

  return priceListCustomerGroups
}