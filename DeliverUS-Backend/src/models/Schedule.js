import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Schedule.belongsTo(models.Product, {foreignKey: 'productId', onDelete: 'CASCADE'})
      Schedule.belongsTo(models.Restauran, {foreignKey: 'restaurantId', onDelete: 'CASCADE'})
    }
  }

  Schedule.init({
    startTime: {
      allowNull: false,
      type: sequelize.TIME
    },
    endTime: {
      allowNull: false,
      type: sequelize.TIME
    },
    productId: {
      allowNull: false,
      type: sequelize.INTEGER,
      references: {
        model: 'Products',
        key: 'id'
      },
      onDelete:'CASCADE'
    },
    restaurantId: {
      allowNull: false,
      type: sequelize.INTEGER,
      references: {
        model: 'Restaurants',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }

  }, {
    sequelize,
    modelName: 'Schedule'
  })

  return Schedule
}

export default loadModel
