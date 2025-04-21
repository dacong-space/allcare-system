'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 将数值字段从 STRING 转为 INTEGER，显式 cast
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "age" TYPE INTEGER USING "age"::integer;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "hours" TYPE INTEGER USING "hours"::integer;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "joinCount" TYPE INTEGER USING "joinCount"::integer;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "points" TYPE INTEGER USING "points"::integer;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "sharedAttemptHours" TYPE INTEGER USING "sharedAttemptHours"::integer;
    `);

    // 将日期字段从 STRING 转为 DATE，显式 cast
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "birthday" TYPE DATE USING "birthday"::date;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "joinDate" TYPE DATE USING "joinDate"::date;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "lastVisitDate" TYPE DATE USING "lastVisitDate"::date;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "lastCarePlanDate" TYPE DATE USING "lastCarePlanDate"::date;
    `);

    // 将结构化字段改为 JSONB，显式 cast
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "language" TYPE JSONB USING "language"::jsonb;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "emergencyContact" TYPE JSONB USING "emergencyContact"::jsonb;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Customers" ALTER COLUMN "preferredDate" TYPE JSONB USING "preferredDate"::jsonb;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // 回退数值字段为 STRING
    await queryInterface.changeColumn('Customers', 'age', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'hours', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'joinCount', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'points', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'sharedAttemptHours', { type: Sequelize.STRING, allowNull: true });

    // 回退日期字段为 STRING
    await queryInterface.changeColumn('Customers', 'birthday', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'joinDate', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'lastVisitDate', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.changeColumn('Customers', 'lastCarePlanDate', { type: Sequelize.STRING, allowNull: true });

    // 回退 JSONB 字段为 TEXT
    await queryInterface.changeColumn('Customers', 'language', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.changeColumn('Customers', 'emergencyContact', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.changeColumn('Customers', 'preferredDate', { type: Sequelize.TEXT, allowNull: true });
  }
};
