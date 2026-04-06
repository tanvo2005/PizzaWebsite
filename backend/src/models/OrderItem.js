const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: 'order_id',
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'price',
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'total_price',
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large'),
    defaultValue: 'medium',
    allowNull: false,
  },
  toppings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  productName: {
    type: DataTypes.STRING,
    field: 'product_name',
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.TEXT,
    field: 'product_description',
    allowNull: true,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
  indexes: [
    { fields: ['order_id'] },
    { fields: ['product_id'] },
  ],
});

OrderItem.beforeCreate(async (orderItem) => {
  orderItem.totalPrice = parseFloat(orderItem.unitPrice) * orderItem.quantity;
});

OrderItem.beforeUpdate(async (orderItem) => {
  if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
    orderItem.totalPrice = parseFloat(orderItem.unitPrice) * orderItem.quantity;
  }
});

module.exports = OrderItem;
