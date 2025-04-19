// Migration: 全量重建 Customers 表，字段名全部小写，类型与模型一致
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
    await queryInterface.createTable('Customers', {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      age: Sequelize.STRING,
      gender: Sequelize.STRING,
      language: Sequelize.TEXT,
      phone: Sequelize.STRING,
      email: Sequelize.STRING,
      city: Sequelize.STRING,
      hours: Sequelize.STRING,
      joinDate: Sequelize.STRING,
      joinCount: Sequelize.STRING,
      points: Sequelize.STRING,
      status: Sequelize.STRING,
      lastVisitDate: Sequelize.STRING,
      rn: Sequelize.STRING,
      pca: Sequelize.STRING,
      supportPlanner: Sequelize.STRING,
      address: Sequelize.STRING,
      notes: Sequelize.TEXT,
      emergencyContact: Sequelize.TEXT,
      birthday: Sequelize.STRING,
      sharedAttemptHours: Sequelize.STRING,
      pca_2: Sequelize.STRING,
      pca_3: Sequelize.STRING,
      preferredDate: Sequelize.STRING,
      healthNotes: Sequelize.TEXT,
      lastCarePlanDate: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};
