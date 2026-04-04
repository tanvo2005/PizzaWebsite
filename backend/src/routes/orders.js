// routes/orders.js - Order Routes
// Định nghĩa các routes cho đơn hàng

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/OrderController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// Lấy tất cả đơn hàng (chỉ admin) - PHẢI ĐẶT TRƯỚC routes/:id
router.get('/', verifyToken, authorizeRole('admin'), getAllOrders);

// Lấy đơn hàng của user hiện tại (user đã đăng nhập)
router.get('/my-orders', verifyToken, getUserOrders);

// Lấy chi tiết đơn hàng theo ID (user đã đăng nhập, chỉ đơn của mình)
router.get('/:id', verifyToken, getOrderById);

// Tạo đơn hàng mới (user đã đăng nhập)
router.post('/', verifyToken, createOrder);

// Cập nhật trạng thái đơn hàng (chỉ admin)
router.put('/:id', verifyToken, authorizeRole('admin'), updateOrderStatus);

module.exports = router;