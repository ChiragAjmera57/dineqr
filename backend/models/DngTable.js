const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DngTable = sequelize.define('DngTable', {
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
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          modal:'Admins',
          key: 'id'
        }
      },
      
    });
    DngTable.associate = (models) => {

      DngTable.belongsTo(models.Admin, {
        foreignKey: 'admin_id',
        as: 'admin',
      });
      DngTable.hasMany(models.Session, {
        foreignKey:'table_id',
        as:'table'
      })
    }
    return DngTable;

  }