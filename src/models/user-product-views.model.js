const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userProductViews = sequelizeClient.define(
    'user_product_views',
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      off_line_token: {
        type: DataTypes.STRING
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

  // userProductViews.associate = function (models) {
  //   // TODO
  // }

  // userProductViews.sync({ alter: true }).catch(err => console.log(err))

  return userProductViews
}