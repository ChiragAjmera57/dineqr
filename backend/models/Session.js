const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.UUID(),
      unique: true,
      required: true,
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DngTables",
        key: "id",
      },
    },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  });
  Session.associate = (models) => {
    Session.belongsTo(models.DngTable, {
      foreignKey: "table_id",
      as: "table",
    });
  };

  return Session;
};
