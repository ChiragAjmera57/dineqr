'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'session_id', {
      type: Sequelize.UUID(),
      allowNull: false,
    });
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'session_id');
  }
};