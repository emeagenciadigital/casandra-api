const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const courseBenefits = sequelizeClient.define(
    'course_benefits',
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

  courseBenefits.associate = function (models) {
    courseBenefits.belongsTo(models.courses, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'course'
    })
  }

  // courseBenefits.sync({ alter: true }).catch(err => console.log(err))

  return courseBenefits
}