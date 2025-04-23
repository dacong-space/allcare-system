const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('todo', 'inProgress', 'done'),
    defaultValue: 'todo',
  },
  dueDate: DataTypes.DATEONLY,
  assignee: DataTypes.STRING,
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
