module.exports = (sequelize, DataTypes) => {
  const SessionFingerprint = sequelize.define('SessionFingerprint', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sessions',
        key: 'session_id',
      },
    },
    fingerprint_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  SessionFingerprint.associate = (models) => {
    SessionFingerprint.belongsTo(models.Session, {
      foreignKey: 'session_id',
      as: 'session',
    });
  };

  return SessionFingerprint;
};