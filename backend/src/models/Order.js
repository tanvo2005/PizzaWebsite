const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Cho phép số VN 10 chữ số: 0xxxxxxxxx hoặc +84xxxxxxxxx
      is: /^(\+?84|0)\d{9}$/,
    },
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100],
    },
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'online'),
    defaultValue: 'cash',
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  orderTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['orderTime'] },
  ],
});

Order.findByUser = function findByUser(userId) {
  return this.findAll({
    where: { userId },
    order: [['orderTime', 'DESC']],
    include: [{ model: require('./OrderItem'), as: 'items' }],
  });
};

Order.findPending = function findPending() {
  return this.findAll({
    where: { status: ['pending', 'confirmed', 'preparing'] },
    order: [['orderTime', 'ASC']],
  });
};

module.exports = Order;
