const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userPayments = sequelizeClient.define(
    'user_payments',
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
          'admin',
          'return'
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
      amount_paid_from_gateway: {
        type: DataTypes.DOUBLE,
      },
      amount_paid_from_wallet: {
        type: DataTypes.DOUBLE,
      },
      payment_meta_data: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'error'
        )
      },
    },
    {
      // paranoid: true,
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      }
    }
  )

  //   sequelizeClient.query(`
  //   create view user_payments as
  // select payments.*
  // from (select row_number() over () as id, pp.*
  //       from (select wallet_movements.user_id,
  //                    wallet_movements.type,
  //                    wallet_movements.amount_net,
  //                    wallet_movements.description,
  //                    wallet_movements.createdAt,
  //                    wallet_movements.updatedAt,
  //                    orders.amount_paid_from_gateway,
  //                    orders.amount_paid_from_wallet,
  //                    orders.payment_meta_data,
  //                    'approved' as status
  //             from wallet_movements
  //                      left join orders on wallet_movements.payment_id = orders.id and wallet_movements.type = 'payment'

  //             where wallet_movements.deletedAt is null

  //             union all
  //             select orders.user_id,
  //                    'payment'                                                  as type,
  //                    orders.total_price                                         as amount_net,
  //                    concat('Compra #', orders.id)                              as description,
  //                    orders.createdAt,
  //                    orders.updatedAt,
  //                    orders.total_price                                         as amount_paid_from_gateway,
  //                    0                                                          as amount_paid_from_wallet,
  //                    orders.payment_meta_data,
  //                    case
  //                        when orders.order_status_id in (3, 5, 6, 7, 8, 9) then 'approved'
  //                        when orders.order_status_id in (1, 4) then 'pending'
  //                        when orders.order_status_id in (13) then 'error'
  //                        when orders.order_status_id in (2) then 'rejected' end as status
  //             from orders
  //             where orders.order_status_id in (3, 5, 6, 7, 8, 9)
  //                 and orders.deletedAt is null

  //                 and orders.amount_paid_from_wallet is null
  //                or orders.amount_paid_from_wallet = 0) as pp
  //       order by pp.createdAt asc) as payments
  // order by payments.createdAt asc
  //   `)

  return userPayments
}