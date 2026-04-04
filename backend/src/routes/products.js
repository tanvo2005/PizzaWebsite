// routes/products.js - Product Routes
// Định nghĩa các routes cho sản phẩm

const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/ProductController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// Lấy tất cả sản phẩm (public)
router.get('/', getAllProducts);

// Lấy sản phẩm theo category (public)
router.get('/category/:category', getProductsByCategory);

// Lấy sản phẩm theo ID (public)
router.get('/:id', getProductById);

// Tạo sản phẩm mới (chỉ admin)
router.post('/', verifyToken, authorizeRole('admin'), createProduct);

// Cập nhật sản phẩm (chỉ admin)
router.put('/:id', verifyToken, authorizeRole('admin'), updateProduct);

// Xóa sản phẩm (chỉ admin)
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteProduct);

module.exports = router;