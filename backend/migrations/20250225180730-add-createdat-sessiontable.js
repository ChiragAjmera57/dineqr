'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessions', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('Sessions', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sessions', 'createdAt');
    await queryInterface.removeColumn('Sessions', 'updatedAt');
  }
};
