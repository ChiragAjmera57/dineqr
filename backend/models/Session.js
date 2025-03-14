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
    users_involved:{
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of user IDs (strings)
      allowNull: false,
      defaultValue: []
    },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  });
  Session.associate = (models) => {
    Session.belongsTo(models.DngTable, {
      foreignKey: "table_id",
      as: "table",
    });
    Session.hasMany(models.SessionFingerprint, {
      foreignKey: 'session_id',
      as: 'fingerprints',
    });
  };

  return Session;
};
