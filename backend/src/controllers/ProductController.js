const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Product } = require('../models');

const uploadsDir = path.join(__dirname, '../../uploads');

const buildImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const getLocalUploadPath = (imageValue) => {
  if (!imageValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(imageValue);
    if (!parsedUrl.pathname.startsWith('/uploads/')) {
      return null;
    }

    return path.join(uploadsDir, path.basename(parsedUrl.pathname));
  } catch (error) {
    if (!imageValue.startsWith('/uploads/')) {
      return null;
    }

    return path.join(uploadsDir, path.basename(imageValue));
  }
};

const removeLocalUpload = (imageValue) => {
  const filePath = getLocalUploadPath(imageValue);

  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const parseIngredients = (ingredients) => {
  if (ingredients === undefined) {
    return undefined;
  }

  if (Array.isArray(ingredients)) {
    return ingredients;
  }

  if (typeof ingredients === 'string') {
    const normalized = ingredients.trim();

    if (!normalized) {
      return [];
    }

    try {
      const parsed = JSON.parse(normalized);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return normalized
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const getAllProducts = async (req, res, next) => {
  try {
    const { category, available, search } = req.query;
    const where = {};

    if (category) where.category = category;
    if (available !== undefined) where.isAvailable = available === 'true';
    if (search) {
      where.name = {
        [Op.like]: `%${search.trim()}%`
      };
    }

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

const createProduct = async (req, res, next) => {
  const uploadedImageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;

  try {
    const { name, description, price, image, category } = req.body;
    const parsedPrice = Number.parseFloat(price);
    const parsedIngredients = parseIngredients(req.body.ingredients);
    const imageUrl = uploadedImageUrl || image?.trim() || null;

    if (!name || !description || Number.isNaN(parsedPrice)) {
      if (uploadedImageUrl) {
        removeLocalUpload(uploadedImageUrl);
      }

      return res.status(400).json({
        success: false,
        message: 'Name, description, and valid price are required'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      image: imageUrl,
      category: category || 'special',
      ingredients: parsedIngredients || []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    if (uploadedImageUrl) {
      removeLocalUpload(uploadedImageUrl);
    }

    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const uploadedImageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;

  try {
    const { id } = req.params;
    const { name, description, price, image, category, isAvailable } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      if (uploadedImageUrl) {
        removeLocalUpload(uploadedImageUrl);
      }

      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) {
      const parsedPrice = Number.parseFloat(price);

      if (Number.isNaN(parsedPrice)) {
        if (uploadedImageUrl) {
          removeLocalUpload(uploadedImageUrl);
        }

        return res.status(400).json({
          success: false,
          message: 'Price must be a valid number'
        });
      }

      updateData.price = parsedPrice;
    }

    if (uploadedImageUrl) {
      updateData.image = uploadedImageUrl;
    } else if (image !== undefined) {
      updateData.image = image ? image.trim() : null;
    }

    if (category !== undefined) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable === true || isAvailable === 'true';
    if (req.body.ingredients !== undefined) updateData.ingredients = parseIngredients(req.body.ingredients);

    const previousImage = product.image;
    await product.update(updateData);

    if (updateData.image && previousImage && previousImage !== updateData.image) {
      removeLocalUpload(previousImage);
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    if (uploadedImageUrl) {
      removeLocalUpload(uploadedImageUrl);
    }

    next(error);
  }
};

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

    removeLocalUpload(product.image);
    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

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
