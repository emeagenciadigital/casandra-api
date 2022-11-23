const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userCourses = sequelizeClient.define(
    'user_courses',
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      progress: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0%',
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

  userCourses.associate = function (models) {
    userCourses.belongsTo(models.courses, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'course'
    })
    userCourses.hasMany(models.user_course_chapter_views, {
      foreignKey: 'user_course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'chapter_views'
    })
  }

  // userCourses.sync({ alter: true }).catch(err => console.log(err))

  return userCourses
}