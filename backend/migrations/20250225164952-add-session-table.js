'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions',{
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.UUID(),
        unique: true,
        required: true,
      },
      table_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "DngTables",
          key: "id",
        },
      },
      expires_at: { type: Sequelize.DATE, allowNull: false },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Sessions');
  }
};
