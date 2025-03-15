module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
        allowNull: false,
        defaultValue: 'pending',
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      table_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model:'DngTables',
          key: 'id'
        }
      },
      session_id: {
        type: DataTypes.UUID(),
        allowNull:false
      }
      
});
  Order.associate = (models) => {
    Order.belongsTo(models.DngTable, {
      foreignKey: 'table_id',
      as: 'table',
      onDelete: 'SET NULL',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems',
    });
  }
  return Order;
}