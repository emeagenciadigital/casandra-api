const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const courseChapters = sequelizeClient.define(
    'course_chapters',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path_video: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      course_section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('free', 'paid'),
        allowNull: false,
      },
      duration: {
        type: DataTypes.TIME,
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

  courseChapters.associate = function (models) {
    courseChapters.belongsTo(models.course_sections, {
      foreignKey: 'course_section_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'section'
    })
    courseChapters.belongsTo(models.courses, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'course'
    })
  }

  // courseChapters.sync({ alter: true }).catch(err => console.log(err))

  return courseChapters
}