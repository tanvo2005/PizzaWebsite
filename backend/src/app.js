// app.js - Main Application File
// File chính của ứng dụng Express.js

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

// Khởi tạo Express app
const app = express();

// Middleware cơ bản
app.use(cors()); // Cho phép CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Route gốc
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pizza Ordering API is running...',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      inventory: '/api/inventory'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Global error handler (phải để cuối cùng)
app.use(errorHandler);

// 404 handler - xử lý tất cả routes không tìm thấy
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Kết nối database và sync models
const initializeDatabase = async () => {
  try {
    // Test kết nối
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');

    // Sync models (tạo bảng nếu chưa có)
    await sequelize.sync({ alter: true }); // alter: true để update schema
    console.log(' Database synchronized successfully.');

  } catch (error) {
    console.error(' Database initialization failed:', error);
    process.exit(1);
  }
};

// Khởi tạo database
initializeDatabase();

module.exports = app;