// models/OrderItem.js - OrderItem Model
// Định nghĩa model OrderItem cho bảng order_items
// Model này đại diện cho từng item trong đơn hàng

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1 // Tối thiểu 1 sản phẩm
    }
  },

  unitPrice: {
    type: DataTypes.DECIMAL(10, 2), // Giá tại thời điểm đặt
    allowNull: false,
    validate: {
      min: 0
    }
  },

  totalPrice: {
    type: DataTypes.DECIMAL(10, 2), // quantity * unitPrice
    allowNull: false,
    validate: {
      min: 0
    }
  },

  // Tùy chọn cho pizza
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large'),
    defaultValue: 'medium',
    allowNull: false
  },

  toppings: {
    type: DataTypes.JSON, // Mảng toppings đã chọn
    allowNull: true,
    defaultValue: []
  },

  // Thông tin sản phẩm tại thời điểm đặt (để tránh thay đổi sau này)
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  productDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['productId'] }
  ]
});

// Hooks
OrderItem.beforeCreate(async (orderItem) => {
  // Tự động tính totalPrice
  orderItem.totalPrice = parseFloat(orderItem.unitPrice) * orderItem.quantity;
});

OrderItem.beforeUpdate(async (orderItem) => {
  // Cập nhật totalPrice khi thay đổi quantity hoặc unitPrice
  if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
    orderItem.totalPrice = parseFloat(orderItem.unitPrice) * orderItem.quantity;
  }
});

module.exports = OrderItem;