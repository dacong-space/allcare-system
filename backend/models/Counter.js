// 计数器模型，用于生成全局自增客户ID
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Counter = sequelize.define('Counter', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

module.exports = Counter;
