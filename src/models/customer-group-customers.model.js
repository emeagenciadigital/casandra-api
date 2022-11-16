const { DataTypes } = require("sequelize")
const usersSequelizeModel = require("./users.sequelize.model")

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const customerGroupCustomers = sequelizeClient.define(
    'customer_group_customers',
    {
      customer_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
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

  customerGroupCustomers.associate = function (models) {
    customerGroupCustomers.belongsTo(models.customer_group, {
      foreignKey: 'customer_group_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'group',
    })
    customerGroupCustomers.belongsTo(usersSequelizeModel(app), {
      foreignKey: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'customer',
    })
  }

  // customerGroupCustomers.sync({ alter: true }).catch(err => console.log(err))

  return customerGroupCustomers
}