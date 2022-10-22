const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const workOffers = sequelizeClient.define(
    'work_offers',
    {
      path_cover: {
        type: DataTypes.STRING,
      },
      job: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      job_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNullL: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      responsibilities: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM('inactive', 'active'),
        allowNull: false,
        defaultValue: 'inactive',
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

  // workOffers.sync({ alter: true }).catch(err => console.log(err))

  return workOffers
}