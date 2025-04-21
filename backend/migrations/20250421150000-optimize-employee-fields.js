'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() !== 'postgres') {
      return Promise.resolve();
    }
    // 创建并忽略已存在的 gender ENUM
    try {
      await queryInterface.sequelize.query("CREATE TYPE enum_employees_gender AS ENUM('男','女');");
    } catch (err) {}
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE enum_employees_gender USING "gender"::enum_employees_gender;
    `);
    // 创建并忽略已存在的 status ENUM
    try {
      await queryInterface.sequelize.query("CREATE TYPE enum_employees_status AS ENUM('active','inactive','onleave');");
    } catch (err) {}
    // 移除旧默认值以支持类型转换
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" DROP DEFAULT;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" TYPE enum_employees_status USING "status"::enum_employees_status;
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
    if (queryInterface.sequelize.getDialect() !== 'postgres') {
      return Promise.resolve();
    }
    // 回退 gender 和 status 为 VARCHAR
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE VARCHAR USING "gender"::varchar;
    `);
    try { await queryInterface.sequelize.query("DROP TYPE enum_employees_gender;"); } catch (err) {}
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "status" TYPE VARCHAR USING "status"::varchar;
    `);
    try { await queryInterface.sequelize.query("DROP TYPE enum_employees_status;"); } catch (err) {}
    // 回退 emergencyContact 为 JSON
    await queryInterface.sequelize.query(`
      ALTER TABLE "Employees" ALTER COLUMN "emergencyContact" TYPE JSON USING "emergencyContact"::json;
    `);
  }
};
