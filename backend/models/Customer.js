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
  language: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('language', typeof value === 'string' ? value : JSON.stringify(value || []));
    }
  },
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
  emergencyContact: {
    type: DataTypes.TEXT,
    allowNull: true,
    set(value) {
      this.setDataValue('emergencyContact', typeof value === 'string' ? value : JSON.stringify(value || {}));
    }
  },
  birthday: DataTypes.STRING, // 生日，类型保持字符串，兼容表结构
  sharedAttemptHours: DataTypes.STRING, // Shared Attempt Hours
  pca_2: DataTypes.STRING, // PCA_2
  pca_3: DataTypes.STRING, // PCA_3
  preferredDate: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      this.setDataValue('preferredDate', typeof value === 'string' ? value : JSON.stringify(value || []));
    }
  },
  healthNotes: DataTypes.TEXT, // healthNotes
  lastCarePlanDate: DataTypes.STRING // 最新Care Plan日期
});

module.exports = Customer;
