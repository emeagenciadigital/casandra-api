const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const walletMovements = sequelizeClient.define(
    'wallet_movements',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'bonus',
          'cashback',
          'recharge',
          'payment',
          'expired',
          'admin'
        ),
        allowNull: false,
      },
      amount_net: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      payment_id: {
        type: DataTypes.INTEGER,
      },
      created_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bonus_id: {
        type: DataTypes.INTEGER,
      },
      bonus_name: {
        type: DataTypes.STRING,
      },
      expired_day: {
        type: DataTypes.DATE,
      },
      expired_status: {
        type: DataTypes.ENUM(
          'waiting',
          'expired',
          'used'
        ),
      },
      expired_wallet_movement_id: {
        type: DataTypes.INTEGER,
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'bonus_id']
        }
      ],
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      }
    }
  )

  walletMovements.associate = function (models) {
    walletMovements.belongsTo(models.wallet_bonus, {
      foreignKey: 'bonus_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'bonus'
    })
  }

  // walletMovements.sync({ alter: true }).catch(err => console.log(err))

  return walletMovements
}