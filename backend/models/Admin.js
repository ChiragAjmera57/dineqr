module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
      org_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    });
    Admin.associate = (models) => {
      Admin.hasMany(models.DngTable, {
        foreignKey: 'admin_id',
        as: 'dngTables',
      });
      Admin.hasMany(models.Menu, {
        foreignKey: 'admin_id',
        as: 'menus',
      });
      
    }
    return Admin;
  };