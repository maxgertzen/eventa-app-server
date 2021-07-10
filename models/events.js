'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Events.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    dateStart: DataTypes.DATE,
    dateEnd: DataTypes.DATE,
    timeStart: DataTypes.TIME,
    timeEnd: DataTypes.TIME,
    isPublic: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    image: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Events',
  });
  return Events;
};