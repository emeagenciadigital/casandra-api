const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const courseRating = sequelizeClient.define(
    'course_rating',
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
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

  courseRating.associate = function (models) {
    // Require migrate model users to sequelize
    // courseRating.belongsTo(models.users, {
    //   foreignKey: 'user_id',
    //   onUpdate: 'CASCADE',
    //   onDelete: 'RESTRICT',
    //   as: 'user'
    // })
    courseRating.belongsTo(models.courses, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'course'
    })
  }

  // courseRating.sync({ alter: true }).catch(err => console.log(err))

  return courseRating
}