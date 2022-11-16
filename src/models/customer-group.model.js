const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const customerGroup = sequelizeClient.define(
    'customer_group',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      name: {
        singular: 'customer_group',
        plural: 'customer_groups'
      },
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      }
    }
  )

  customerGroup.associate = function (models) {
    customerGroup.hasMany(models.price_list_customer_groups, {
      foreignKey: 'customer_group_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'price_lists'
    })
    customerGroup.hasMany(models.customer_group_customers, {
      foreignKey: 'customer_group_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'customers'
    })
  }

  // customerGroup.sync({ alter: true }).catch(err => console.log(err))

  return customerGroup
}