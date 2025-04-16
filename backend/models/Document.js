const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: DataTypes.STRING,
  path: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,
  createdAt: DataTypes.DATE,
  category: DataTypes.STRING,
  subcategory: DataTypes.STRING,
  uploadBy: DataTypes.STRING
});

module.exports = Document;
