'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Record.belongsTo(models.User, { foreignKey: 'userId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
      Record.belongsTo(models.Category, { foreignKey: 'categoryId', onUpdate: 'CASCADE', onDelete: 'CASCADE' });
    }
  }
  Record.init({
    name: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    amount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Record',
  });
  return Record;
};