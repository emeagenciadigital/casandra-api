const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const coursesCategories = sequelizeClient.define(
    'courses_categories',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive'
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      path_image: {
        type: DataTypes.STRING,
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

  // coursesCategories.sync({ alter: true }).catch(err => console.log(err))

  return coursesCategories
}