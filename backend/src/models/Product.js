// models/Product.js - Product Model
// Định nghĩa model Product cho bảng products
// Model này đại diện cho các sản phẩm pizza trong hệ thống

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200] // Tên sản phẩm 2-200 ký tự
    }
  },

  description: {
    type: DataTypes.TEXT, // TEXT cho mô tả dài
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  price: {
    type: DataTypes.DECIMAL(10, 2), // Giá với 2 số thập phân
    allowNull: false,
    validate: {
      min: 0 // Giá không âm
    }
  },

  image: {
    type: DataTypes.STRING, // URL hoặc path của hình ảnh
    allowNull: true
  },

  category: {
    type: DataTypes.ENUM('vegetarian', 'meat', 'vegan', 'special'), // Các loại pizza
    allowNull: false,
    defaultValue: 'special'
  },

  isAvailable: {
    type: DataTypes.BOOLEAN, // Có sẵn hay không
    defaultValue: true,
    allowNull: false
  },

  ingredients: {
    type: DataTypes.JSON, // Mảng nguyên liệu dưới dạng JSON
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true, // Thêm createdAt, updatedAt
  indexes: [
    // Index cho tìm kiếm nhanh
    { fields: ['category'] },
    { fields: ['isAvailable'] },
    { fields: ['name'] }
  ]
});

// Class methods
Product.findAvailable = function() {
  // Tìm các sản phẩm có sẵn
  return this.findAll({
    where: { isAvailable: true },
    order: [['createdAt', 'DESC']]
  });
};

Product.findByCategory = function(category) {
  // Tìm sản phẩm theo category
  return this.findAll({
    where: { category, isAvailable: true },
    order: [['name', 'ASC']]
  });
};

module.exports = Product;