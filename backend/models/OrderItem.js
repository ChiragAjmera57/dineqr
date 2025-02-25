const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          modal:'Orders',
          key: 'id'
        }
      },
      menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          modal:'Menus',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
});
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Menu, {
      foreignKey: 'menu_id',
      as: 'menu',
    });
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
  }
  return OrderItem;
}