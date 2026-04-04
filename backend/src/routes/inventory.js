// routes/inventory.js - Inventory Routes
// Định nghĩa các routes cho quản lý kho

const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  restockInventory,
  deleteInventoryItem,
  getInventoryReport
} = require('../controllers/InventoryController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// Lấy tất cả item trong kho (chỉ admin)
router.get('/', verifyToken, authorizeRole('admin'), getAllInventory);

// Lấy báo cáo kho (chỉ admin)
router.get('/report', verifyToken, authorizeRole('admin'), getInventoryReport);

// Lấy item theo ID (chỉ admin)
router.get('/:id', verifyToken, authorizeRole('admin'), getInventoryById);

// Tạo item mới (chỉ admin)
router.post('/', verifyToken, authorizeRole('admin'), createInventoryItem);

// Cập nhật item (chỉ admin)
router.put('/:id', verifyToken, authorizeRole('admin'), updateInventoryItem);

// Nhập thêm nguyên liệu (chỉ admin)
router.put('/:id/restock', verifyToken, authorizeRole('admin'), restockInventory);

// Xóa item (chỉ admin)
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteInventoryItem);

module.exports = router;