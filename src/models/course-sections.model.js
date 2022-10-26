const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const courseSections = sequelizeClient.define(
    'course_sections',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      course_id: {
        type: DataTypes.INTEGER,
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

  courseSections.associate = function (models) {
    courseSections.belongsTo(models.courses, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'course'
    })
    courseSections.hasMany(models.course_chapters, {
      foreignKey: 'course_section_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'chapters'
    })
  }

  // courseSections.sync({ alter: true }).catch(err => console.log(err))

  return courseSections
}