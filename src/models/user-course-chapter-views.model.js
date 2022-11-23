const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const userCourseChapterViews = sequelizeClient.define(
    'user_course_chapter_views',
    {
      user_course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meta_course_id: {
        type: DataTypes.INTEGER,
      },
      time: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM('watching', 'viewed'),
        allowNull: false,
        defaultValue: 'watching',
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

  userCourseChapterViews.associate = function (models) {
    userCourseChapterViews.belongsTo(models.user_courses, {
      foreignKey: 'user_course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'user_course'
    })
    userCourseChapterViews.belongsTo(models.course_chapters, {
      foreignKey: 'chapter_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'chapter'
    })
  }

  // userCourseChapterViews.sync({ alter: true }).catch(err => console.log(err))

  return userCourseChapterViews
}