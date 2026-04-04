// controllers/ProductController.js - Product Controller
// Xử lý các API CRUD cho sản phẩm (pizza)

const { Product } = require('../models');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res, next) => {
  try {
    const { category, available } = req.query;

    // Build where condition
    const where = {};
    if (category) where.category = category;
    if (available !== undefined) where.isAvailable = available === 'true';

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    next(error);
  }
};

// Tạo sản phẩm mới (chỉ admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, ingredients } = req.body;

    // Validate required fields
    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and price are required'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image,
      category: category || 'special',
      ingredients: ingredients || []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    next(error);
  }
};

// Cập nhật sản phẩm (chỉ admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, isAvailable, ingredients } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (ingredients !== undefined) updateData.ingredients = ingredients;

    await product.update(updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });

  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm (chỉ admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Lấy sản phẩm theo category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await Product.findByCategory(category);

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};