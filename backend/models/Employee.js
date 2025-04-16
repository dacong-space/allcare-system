const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  language: DataTypes.STRING, // 存储为 JSON 字符串
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.STRING,
  joinDate: DataTypes.STRING,
  position: DataTypes.STRING,
  status: DataTypes.STRING,
  notes: DataTypes.TEXT
});

module.exports = Employee;
