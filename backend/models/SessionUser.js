module.exports = (sequelize, DataTypes) => {
    const SessionUser = sequelize.define("SessionUser", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Sessions",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    SessionUser.associate = (models) => {
      SessionUser.belongsTo(models.Session, {
        foreignKey: "session_id",
        as: "session",
        onDelete: 'SET NULL',
      });
      SessionUser.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: 'SET NULL',
      });
    };
  
    return SessionUser;
  };
  