const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM(
      'vegetarian',
      'pizza',
      'gachien',
      'khaivi',
      'thucuong',
      'menu49',
      'compo',
      'meat',
      'vegan',
      'special'
    ),
    // Giữ cả key cũ lẫn key mới để admin form mới hoạt động
    // mà không làm lỗi các record đã có sẵn trong database.
    allowNull: false,
    defaultValue: 'pizza',
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['isAvailable'] },
    { fields: ['name'] },
  ],
});

Product.findAvailable = function findAvailable() {
  return this.findAll({
    where: { isAvailable: true },
    order: [['createdAt', 'DESC']],
  });
};

Product.findByCategory = function findByCategory(category) {
  return this.findAll({
    where: { category, isAvailable: true },
    order: [['name', 'ASC']],
  });
};

module.exports = Product;
