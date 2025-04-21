'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Employees', 'language', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Employees', 'language', {
      type: Sequelize.JSON,
      defaultValue: []
    });
  }
};
