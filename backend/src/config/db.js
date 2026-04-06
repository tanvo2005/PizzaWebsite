// config/db.js - Database Configuration
// File này cấu hình kết nối đến MySQL database sử dụng Sequelize ORM

const { Sequelize } = require("sequelize"); // Import Sequelize ORM
require("dotenv").config(); // Load biến môi trường từ .env

// Tạo instance Sequelize với thông tin database từ .env
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Tên database (pizza_app)
  process.env.DB_USER,     // Username MySQL (root)
  process.env.DB_PASSWORD, // Password MySQL
  {
    host: process.env.DB_HOST,     // Host MySQL (localhost)
    port: process.env.DB_PORT,     // Port MySQL (3306)
    dialect: "mysql",              // Loại database
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log queries trong dev mode
    pool: {                        // Connection pool settings
      max: 5,                      // Max connections
      min: 0,                      // Min connections
      acquire: 30000,              // Max time to get connection (ms)
      idle: 10000                  // Max idle time (ms)
    }
  }
);

// Test kết nối database
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection has been established successfully.');
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
  }
};

// Gọi test connection khi import file này
testConnection();

module.exports = sequelize; // Export sequelize instance để sử dụng trong models