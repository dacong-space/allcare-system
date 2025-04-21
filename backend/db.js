require('dotenv').config(); // 必须放在最顶部
const { Sequelize } = require('sequelize');

let sequelize;
if (process.env.NODE_ENV === 'test') {
  // 使用内存数据库，关闭日志
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres'
  });
}

module.exports = sequelize;
