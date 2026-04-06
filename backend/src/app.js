const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { backfillLegacyOrderItems } = require('./services/orderItemMigration');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Expose uploaded product images so the frontend can render them via URL.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use(errorHandler);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    await backfillLegacyOrderItems();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();

module.exports = app;
