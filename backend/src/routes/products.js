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
const upload = require('../middleware/upload');

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

router.post('/', verifyToken, authorizeRole('admin'), upload.single('image'), createProduct);
router.put('/:id', verifyToken, authorizeRole('admin'), upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteProduct);

module.exports = router;
