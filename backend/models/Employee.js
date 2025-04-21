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
  birthday: DataTypes.DATE,
  language: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  position: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  joinDate: DataTypes.DATE,
  cprExpire: DataTypes.DATE,
  address: DataTypes.STRING,
  emergencyContact: DataTypes.JSON,
  note: DataTypes.TEXT
});

module.exports = Employee;
