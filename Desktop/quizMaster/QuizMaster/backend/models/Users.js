// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,      // ✅ Username is required
    // unique: true,        // ❌ Not unique, as per your requirement
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,      // ✅ Email is required
    unique: true,          // ✅ Email must be unique
    validate: {
      isEmail: true,       // ✅ Validates email format
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,      // ✅ Password is required
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',  // ✅ Defaults to 'user' if not provided
  }
}, {
  tableName: 'users',      // ✅ Table name is explicitly set
  timestamps: true,        // ✅ Adds createdAt and updatedAt columns
});

module.exports = User;
