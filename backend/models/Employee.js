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
    allowNull: true,
    validate: {
      isEmailOrEmpty(value) {
        if (value && value.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
          throw new Error('请输入有效的邮箱');
        }
      }
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
    { fields: ['status'] },
    { fields: ['joinDate'] }
  ]
});

module.exports = Employee;
