const { Order, OrderItem, Product, User, sequelize } = require('../models');

const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      deliveryAddress,
      phoneNumber,
      customerName,
      paymentMethod,
      specialInstructions,
      shippingFee = 0,
    } = req.body;
    const userId = req.user.id;

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

    const parsedShippingFee = Number.parseFloat(shippingFee || 0) || 0;
    const transaction = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const { productId, quantity, size, toppings } = item;
        const product = await Product.findByPk(productId, { transaction });

        if (!product || !product.isAvailable) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Product ${productId} not found or not available`
          });
        }

        let unitPrice = Number.parseFloat(product.price);
        if (size === 'large') unitPrice *= 1.5;
        else if (size === 'small') unitPrice *= 0.8;

        if (toppings && toppings.length > 0) {
          unitPrice += toppings.length * 20000;
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

      totalAmount += parsedShippingFee;

      const order = await Order.create({
        userId,
        totalAmount,
        deliveryAddress: deliveryAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        customerName: customerName.trim(),
        paymentMethod: paymentMethod || 'cash',
        specialInstructions: specialInstructions?.trim()
      }, { transaction });

      for (const item of orderItems) {
        await OrderItem.create({
          ...item,
          orderId: order.id
        }, { transaction });
      }

      await transaction.commit();

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
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

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

const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = {};

    if (status) where.status = status;

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['orderTime', 'DESC']],
      limit: parsedLimit,
      offset
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parsedPage,
          limit: parsedLimit,
          pages: Math.ceil(count / parsedLimit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

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
