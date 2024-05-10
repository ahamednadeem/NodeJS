const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'users_data', // Specify table name
  createdAt: 'created_at', // Specify createdAt column name
  updatedAt: 'updated_at', // Specify updatedAt column name
});

module.exports = User;
