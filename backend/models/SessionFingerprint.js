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
      },
      fingerprint_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return SessionFingerprint;
  };