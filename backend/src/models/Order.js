// models/Order.js - Order Model
// Định nghĩa model Order cho bảng orders
// Model này đại diện cho đơn hàng của khách hàng

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Tên bảng
      key: 'id'
    }
  },

  totalAmount: {
    type: DataTypes.DECIMAL(10, 2), // Tổng tiền đơn hàng
    allowNull: false,
    validate: {
      min: 0
    }
  },

  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },

  // Thông tin giao hàng
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+?[1-9]\d{1,14}$/ // Regex cho số điện thoại quốc tế
    }
  },

  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },

  // Thông tin thanh toán
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'online'),
    defaultValue: 'cash',
    allowNull: false
  },

  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
    allowNull: false
  },

  // Thời gian
  orderTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Ghi chú đặc biệt
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
    { fields: ['orderTime'] }
  ]
});

// Class methods
Order.findByUser = function(userId) {
  return this.findAll({
    where: { userId },
    order: [['orderTime', 'DESC']],
    include: [{ model: require('./OrderItem'), as: 'items' }]
  });
};

Order.findPending = function() {
  return this.findAll({
    where: { status: ['pending', 'confirmed', 'preparing'] },
    order: [['orderTime', 'ASC']]
  });
};

module.exports = Order;