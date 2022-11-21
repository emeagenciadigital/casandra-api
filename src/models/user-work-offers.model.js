const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userWorkOffers = sequelizeClient.define(
    'user_work_offers',
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      work_offer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_cv_path: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
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

  userWorkOffers.associate = function (models) {
    userWorkOffers.belongsTo(models.work_offers, {
      foreignKey: 'work_offer_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'work_offer'
    })
  }

  // userWorkOffers.sync({ alter: true }).catch(err => console.log(err))

  return userWorkOffers
}