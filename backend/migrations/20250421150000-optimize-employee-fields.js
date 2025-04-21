'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 创建 ENUM 类型并转换 gender
    await queryInterface.sequelize.query(`
      CREATE TYPE IF NOT EXISTS enum_Employees_gender AS ENUM('男','女');
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE enum_Employees_gender USING "gender"::enum_Employees_gender;
    `);
    // 创建 ENUM 类型并转换 status
    await queryInterface.sequelize.query(`
      CREATE TYPE IF NOT EXISTS enum_Employees_status AS ENUM('active','inactive','onleave');
    `);
    // 移除旧默认值以支持类型转换
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" DROP DEFAULT;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" TYPE enum_Employees_status USING "status"::enum_Employees_status;
    `);
    // 重新设置默认值
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" SET DEFAULT 'active';
    `);
    // 将 emergencyContact 转为 JSONB
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "emergencyContact" TYPE JSONB USING "emergencyContact"::jsonb;
    `);
  },
  down: async (queryInterface, Sequelize) => {
    // 回退 gender 和 status 为 VARCHAR
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE VARCHAR USING "gender"::varchar;
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE enum_Employees_gender;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" TYPE VARCHAR USING "status"::varchar;
    `);
    await queryInterface.sequelize.query(`
      DROP TYPE enum_Employees_status;
    `);
    // 回退 emergencyContact 为 JSON
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "emergencyContact" TYPE JSON USING "emergencyContact"::json;
    `);
  }
};
