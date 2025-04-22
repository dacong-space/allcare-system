'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取消 email 列的 not null 约束
    await queryInterface.changeColumn('Employees', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // 移除 email 字段上的唯一索引
    await queryInterface.removeIndex('Employees', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    // 恢复 email 列为 not null
    await queryInterface.changeColumn('Employees', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    // 恢复唯一索引
    await queryInterface.addIndex('Employees', ['email'], {
      unique: true,
    });
  }
};
