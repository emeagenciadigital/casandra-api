const { DataTypes } = require('sequelize')

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient')

  const courses = sequelizeClient.define(
    'courses',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive'
      },
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating_score: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      small_description: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM('principiante', 'avanzado'),
        allowNull: false,
      },
      duration: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      authors: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path_video: {
        type: DataTypes.STRING,
      },
      path_image: {
        type: DataTypes.STRING,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      content_last_updated: {
        type: DataTypes.DATE,
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

  courses.associate = function (models) {
    // Require migrate model productos to sequelize
    // courses.belongsTo(models.products, {
    //   foreignKey: 'product_id',
    //   onUpdate: 'CASCADE',
    //   onDelete: 'RESTRICT',
    //   as: 'product'
    // })
    courses.belongsTo(models.courses_categories, {
      foreignKey: 'category_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'category'
    })
    courses.hasMany(models.course_benefits, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'benefits'
    })
    courses.hasMany(models.course_sections, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'sections'
    })
    courses.hasMany(models.course_chapters, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'chapters'
    })
    courses.hasMany(models.course_rating, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      as: 'ratings'
    })
  }

  // courses.sync({ alter: true }).catch(err => console.log(err))

  return courses
}