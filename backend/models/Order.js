const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      table_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
});
  Order.associate = (models) => {
    Order.belongsTo(models.DngTable, {
      foreignKey: 'table_id',
      as: 'table',
    });
  }
  return Order;
}