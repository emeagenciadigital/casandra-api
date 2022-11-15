const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const workOffers = sequelizeClient.define(
    'work_offers',
    {
      path_cover: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      job: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.ENUM('tiempo_completo', 'medio_tiempo'),
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
      indexes: [
        {
          unique: true,
          fields: ['slug']
        }
      ],
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      }
    }
  )

  workOffers.associate = function (models) {
    workOffers.belongsTo(models.work_offers_categories, {
      foreignKey: 'category_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'category',
    })
  }

  // workOffers.sync({ alter: true }).catch(err => console.log(err))

  return workOffers
}