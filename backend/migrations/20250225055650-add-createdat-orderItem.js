'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderItems', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('OrderItems', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderItems', 'createdAt');
    await queryInterface.removeColumn('OrderItems', 'updatedAt');
  }
};