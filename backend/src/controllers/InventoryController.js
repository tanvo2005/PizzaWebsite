// controllers/InventoryController.js - Inventory Controller
// Xử lý các API quản lý kho nguyên liệu

const { Inventory } = require('../models');

// Lấy tất cả item trong kho
const getAllInventory = async (req, res, next) => {
  try {
    const { lowStock, expiringSoon } = req.query;

    let where = { isActive: true };

    if (lowStock === 'true') {
      // Lọc item sắp hết
      const items = await Inventory.findLowStock();
      return res.json({
        success: true,
        data: { inventory: items }
      });
    }

    if (expiringSoon === 'true') {
      // Lọc item sắp hết hạn
      const items = await Inventory.findExpiringSoon();
      return res.json({
        success: true,
        data: { inventory: items }
      });
    }

    const inventory = await Inventory.findAll({
      where,
      order: [['itemName', 'ASC']]
    });

    res.json({
      success: true,
      data: { inventory }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy item theo ID
const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    next(error);
  }
};

// Tạo item mới trong kho
const createInventoryItem = async (req, res, next) => {
  try {
    const { itemName, quantity, unit, minThreshold, maxCapacity, supplier } = req.body;

    // Validate required fields
    if (!itemName || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item name and quantity are required'
      });
    }

    const item = await Inventory.create({
      itemName: itemName.trim(),
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      minThreshold: minThreshold ? parseFloat(minThreshold) : 10,
      maxCapacity: maxCapacity ? parseFloat(maxCapacity) : null,
      supplier: supplier?.trim(),
      lastRestocked: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: { item }
    });

  } catch (error) {
    next(error);
  }
};

// Cập nhật item trong kho
const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, unit, minThreshold, maxCapacity, supplier, expiryDate, isActive } = req.body;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Build update data
    const updateData = {};
    if (itemName !== undefined) updateData.itemName = itemName.trim();
    if (quantity !== undefined) updateData.quantity = parseFloat(quantity);
    if (unit !== undefined) updateData.unit = unit;
    if (minThreshold !== undefined) updateData.minThreshold = parseFloat(minThreshold);
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity ? parseFloat(maxCapacity) : null;
    if (supplier !== undefined) updateData.supplier = supplier?.trim();
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Nếu cập nhật quantity, cập nhật lastRestocked
    if (quantity !== undefined && quantity > item.quantity) {
      updateData.lastRestocked = new Date();
    }

    await item.update(updateData);

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: { item }
    });

  } catch (error) {
    next(error);
  }
};

// Nhập thêm nguyên liệu (tăng quantity)
const restockInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, supplier } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const newQuantity = item.quantity + parseFloat(quantity);

    // Kiểm tra maxCapacity
    if (item.maxCapacity && newQuantity > item.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Cannot exceed maximum capacity of ${item.maxCapacity} ${item.unit}`
      });
    }

    await item.update({
      quantity: newQuantity,
      lastRestocked: new Date(),
      supplier: supplier || item.supplier
    });

    res.json({
      success: true,
      message: 'Inventory restocked successfully',
      data: { item }
    });

  } catch (error) {
    next(error);
  }
};

// Xóa item khỏi kho (soft delete)
const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await item.update({ isActive: false });

    res.json({
      success: true,
      message: 'Inventory item deactivated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Báo cáo kho
const getInventoryReport = async (req, res, next) => {
  try {
    const [totalItems, lowStockItems, expiringItems] = await Promise.all([
      Inventory.count({ where: { isActive: true } }),
      Inventory.findLowStock(),
      Inventory.findExpiringSoon(30) // 30 ngày
    ]);

    const totalValue = await Inventory.sum('quantity', { where: { isActive: true } });

    res.json({
      success: true,
      data: {
        summary: {
          totalItems,
          lowStockCount: lowStockItems.length,
          expiringCount: expiringItems.length,
          totalValue
        },
        lowStockItems,
        expiringItems
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  restockInventory,
  deleteInventoryItem,
  getInventoryReport
};