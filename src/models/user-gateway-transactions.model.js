const { DataTypes } = require('sequelize')

const UserTransactionType = {
  PAYMENT: 'payment',
  WALLET_RECHARGE: 'wallet_recharge'
}

const GatewayTypes = {
  WOMPI: 'wompi',
}

const TransactionStatus = {
  PENDING: 'pending',
  PROCESSED: 'processed'
}

exports.UserTransactionType = UserTransactionType
exports.GatewayTypes = GatewayTypes
exports.TransactionStatus = TransactionStatus

exports.createModel = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userGatewayTransactions = sequelizeClient.define(
    'user_gateway_transactions',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gateway: {
        type: DataTypes.ENUM(
          GatewayTypes.WOMPI
        ),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          UserTransactionType.PAYMENT,
          UserTransactionType.WALLET_RECHARGE
        ),
        allowNull: false,
      },
      gateway_reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          TransactionStatus.PENDING,
          TransactionStatus.PROCESSED,
        ),
        allowNull: false,
        defaultValue: TransactionStatus.PENDING,
      },
      gateway_status: {
        type: DataTypes.STRING,
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

  // userGatewayTransactions.associate = function (models) {
  //   // TODO
  // }

  // userGatewayTransactions.sync({ alter: true }).catch(err => console.log(err))

  return userGatewayTransactions
}