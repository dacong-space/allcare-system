// backend/models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: { type: DataTypes.STRING, allowNull: false },
  age: DataTypes.STRING,
  gender: DataTypes.STRING,
  language: DataTypes.TEXT, // JSON 字符串，存数组
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  city: DataTypes.STRING,
  hours: DataTypes.STRING,
  joinDate: DataTypes.STRING,
  joinCount: DataTypes.STRING,
  points: DataTypes.STRING,
  status: DataTypes.STRING,
  lastVisitDate: DataTypes.STRING,
  rn: DataTypes.STRING,
  pca: DataTypes.STRING,
  supportPlanner: DataTypes.STRING,
  address: DataTypes.STRING,
  notes: DataTypes.TEXT,
  emergencyContact: DataTypes.TEXT // JSON 字符串，单个对象
});

module.exports = Customer;
