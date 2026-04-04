// models/Inventory.js - Inventory Model
// Định nghĩa model Inventory cho bảng inventories
// Model này quản lý kho nguyên liệu cho các sản phẩm

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Inventory = sequelize.define("Inventory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  itemName: {
    type: DataTypes.STRING, // Tên nguyên liệu (flour, cheese, tomato, etc.)
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },

  quantity: {
    type: DataTypes.DECIMAL(10, 2), // Số lượng hiện tại
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },

  unit: {
    type: DataTypes.ENUM('kg', 'g', 'l', 'ml', 'pieces', 'boxes'), // Đơn vị đo
    allowNull: false,
    defaultValue: 'kg'
  },

  minThreshold: {
    type: DataTypes.DECIMAL(10, 2), // Ngưỡng tối thiểu để cảnh báo
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },

  maxCapacity: {
    type: DataTypes.DECIMAL(10, 2), // Dung tích tối đa
    allowNull: true,
    validate: {
      min: 0
    }
  },

  supplier: {
    type: DataTypes.STRING, // Nhà cung cấp
    allowNull: true
  },

  lastRestocked: {
    type: DataTypes.DATE, // Lần nhập kho cuối
    allowNull: true
  },

  expiryDate: {
    type: DataTypes.DATE, // Ngày hết hạn
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN, // Còn sử dụng hay không
    defaultValue: true,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['itemName'] },
    { fields: ['isActive'] },
    { fields: ['quantity'] }
  ]
});

// Class methods
Inventory.findLowStock = function() {
  // Tìm các item sắp hết
  return this.findAll({
    where: {
      isActive: true,
      quantity: {
        [require('sequelize').Op.lte]: require('sequelize').col('minThreshold')
      }
    },
    order: [['quantity', 'ASC']]
  });
};

Inventory.findExpiringSoon = function(days = 30) {
  // Tìm các item sắp hết hạn
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.findAll({
    where: {
      isActive: true,
      expiryDate: {
        [require('sequelize').Op.lte]: futureDate,
        [require('sequelize').Op.ne]: null
      }
    },
    order: [['expiryDate', 'ASC']]
  });
};

// Instance methods
Inventory.prototype.isLowStock = function() {
  return this.quantity <= this.minThreshold;
};

Inventory.prototype.needsRestock = function() {
  return this.quantity < this.minThreshold;
};

module.exports = Inventory;