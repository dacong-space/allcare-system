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
  gender: {
    type: DataTypes.ENUM('男','女'),
    allowNull: true
  },
  birthday: DataTypes.DATE,
  language: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  position: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('active','inactive','onleave'),
    allowNull: false,
    defaultValue: 'active'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9()\+\-\s]*$/  // 允许数字、空格、+、-、()
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  joinDate: DataTypes.DATE,
  cprExpire: DataTypes.DATE,
  latestTrainingDate: DataTypes.DATE,
  documentExpire: DataTypes.DATE,
  latestExamDate: DataTypes.DATE,
  address: DataTypes.STRING,
  emergencyContact: DataTypes.JSONB,
  note: DataTypes.TEXT
}, {
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['status'] },
    { fields: ['joinDate'] }
  ]
});

module.exports = Employee;
