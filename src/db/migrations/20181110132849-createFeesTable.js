'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'fees',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        rate: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        restrictions: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fees');
  }
};
