module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.UUID(),
      unique: true,
      required: true,
      primaryKey: true
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DngTables",
        key: "id",
      },
      onDelete: 'CASCADE'
    },

    expires_at: { type: DataTypes.DATE, allowNull: false },
  });
  Session.associate = (models) => {
    Session.belongsTo(models.DngTable, {
      foreignKey: "table_id",
      as: "table",
      onDelete: 'SET NULL',
    });
    Session.hasMany(models.SessionUser, {
      foreignKey: 'session_id',
      as: 'sessionUsers',
    });
  };

  return Session;
};
