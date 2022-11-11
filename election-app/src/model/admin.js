const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// 管理员
const AdminMapper = sequelize.define('admins', {
  admin_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  account: DataTypes.STRING(64),
  pass: DataTypes.CHAR(32),
  created_at: DataTypes.TIME,
}, {
  timestamps: false,
});

module.exports = {
  AdminMapper,
};
