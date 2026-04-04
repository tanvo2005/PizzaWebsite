// models/index.js - Models Index
// File này export tất cả models và thiết lập quan hệ giữa các bảng

const sequelize = require('../config/db');

// Import các models
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Inventory = require('./Inventory');

// Thiết lập associations (quan hệ)

// User - Order: 1 User có nhiều Order
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE' // Xóa user thì xóa luôn orders
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Order - OrderItem: 1 Order có nhiều OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Product - OrderItem: 1 Product có thể có trong nhiều OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Export tất cả models
module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Inventory
};