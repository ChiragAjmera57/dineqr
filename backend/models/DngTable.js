const sequelize = require('../config/database');
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
        allowNull: false,
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
    }
    return DngTable;

  }