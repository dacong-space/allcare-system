'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加证件有效期字段
    await queryInterface.addColumn('Employees', 'documentExpire', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    // 添加最新体检日期字段
    await queryInterface.addColumn('Employees', 'latestExamDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Employees', 'documentExpire');
    await queryInterface.removeColumn('Employees', 'latestExamDate');
  }
};
