// controllers/OrderController.js - Order Controller
// Xử lý các API liên quan đến đơn hàng

const { Order, OrderItem, Product, User, sequelize } = require('../models');


// Tạo đơn hàng mới
const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction(); // Sử dụng transaction để đảm bảo tính toàn vẹn

  try {
    const { items, deliveryAddress, phoneNumber, customerName, paymentMethod, specialInstructions } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      });
    }

    if (!deliveryAddress || !phoneNumber || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address, phone number, and customer name are required'
      });
    }

    // Tính tổng tiền và validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity, size, toppings } = item;

      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findByPk(productId);
      if (!product || !product.isAvailable) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Product ${productId} not found or not available`
        });
      }

      // Tính giá dựa trên size (giả lập logic đơn giản)
      let unitPrice = product.price;
      if (size === 'large') unitPrice *= 1.5;
      else if (size === 'small') unitPrice *= 0.8;

      // Thêm phí topping (giả lập)
      if (toppings && toppings.length > 0) {
        unitPrice += toppings.length * 2; // $2 mỗi topping
      }

      const itemTotal = unitPrice * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId,
        quantity,
        unitPrice,
        totalPrice: itemTotal,
        size: size || 'medium',
        toppings: toppings || [],
        productName: product.name,
        productDescription: product.description
      });
    }

    // Tạo order
    const order = await Order.create({
      userId,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      phoneNumber: phoneNumber.trim(),
      customerName: customerName.trim(),
      paymentMethod: paymentMethod || 'cash',
      specialInstructions: specialInstructions?.trim()
    }, { transaction });

    // Tạo order items
    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      }, { transaction });
    }

    await transaction.commit();

    // Lấy order với items
    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: createdOrder }
    });

  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Lấy đơn hàng của user hiện tại
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findByUser(userId);

    res.json({
      success: true,
      data: { orders }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy tất cả đơn hàng (chỉ admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['orderTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái đơn hàng (chỉ admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, deliveryTime } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (deliveryTime) updateData.deliveryTime = new Date(deliveryTime);

    await order.update(updateData);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};