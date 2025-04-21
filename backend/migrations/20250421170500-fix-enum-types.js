'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 修复 gender ENUM 类型
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE TEXT;`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Employees_gender";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_employees_gender;`);
    await queryInterface.sequelize.query(`CREATE TYPE enum_employees_gender AS ENUM('男','女');`);
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "gender" TYPE enum_employees_gender USING gender::enum_employees_gender;`);

    // 修复 status ENUM 类型
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "status" DROP DEFAULT;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "status" TYPE TEXT;`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Employees_status";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS enum_employees_status;`);
    await queryInterface.sequelize.query(`CREATE TYPE enum_employees_status AS ENUM('active','inactive','onleave');`);
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "status" TYPE enum_employees_status USING status::enum_employees_status;`);
    await queryInterface.sequelize.query(`ALTER TABLE "Employees" ALTER COLUMN "status" SET DEFAULT 'active';`);
  },

  down: async (queryInterface, Sequelize) => {
    // 回退脚本暂未实现
  }
};
