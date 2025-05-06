module.exports = (sequelize, DataTypes) => {
    const Menu = sequelize.define('Menu', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model:'Admins',
          key: 'id'
        },
        onDelete: 'CASCADE'
    }
});
  Menu.associate = (models) => {
    Menu.belongsTo(models.Admin, {
      foreignKey: 'admin_id',
      as: 'admin',
    });
    Menu.hasMany(models.OrderItem, {
      foreignKey: 'menu_id',
      as: 'orderItems',
    });
  }
  return Menu;
}