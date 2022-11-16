const { DataTypes } = require('sequelize')
const customerGroupCustomersModel = require('./customer-group-customers.model')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const users = sequelizeClient.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        auoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      dni: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
      facebookId: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
      },
      birthday: {
        type: DataTypes.DATE,
      },
      token_reset_password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(
          'active',
          'inactive',
          'pending validation',
          'pending user data',
          'pending security verification',
          'disabled'
        ),
        allowNull: false,
        defaultValue: 'pending validation',
      },
      device_id: {
        type: DataTypes.STRING,
      },
      ip_address_first: {
        type: DataTypes.STRING,
      },
      ip_address_last: {
        type: DataTypes.STRING,
      },
      disabled_reason: {
        type: DataTypes.STRING,
      },
      credits: {
        type: DataTypes.INTEGER({ length: 255 }),
        defaultValue: 0,
      },
      profile_picture: {
        type: DataTypes.TEXT,
      },
      token_login_email: {
        type: DataTypes.STRING(20),
      },
      token_login_phone: {
        type: DataTypes.STRING(20),
      },
      phone_country_code: {
        type: DataTypes.STRING(20),
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

  users.associate = function () {
    users.hasMany(customerGroupCustomersModel(app), {
      foreignKey: 'user_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'groups',
    })
  }

  // users.sync({ alter: true }).then(() => {
  //   users.associate(app.get('sequelizeClient').models)
  // }).catch(err => console.log(err))

  return users
}