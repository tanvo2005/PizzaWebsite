const { Order, OrderItem, Product, User, sequelize } = require('../models');

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Accept both array payloads and JSON-string payloads for easier frontend integration.
const normalizeItemsPayload = (rawItems) => {
  if (Array.isArray(rawItems)) {
    return rawItems;
  }

  if (typeof rawItems === 'string') {
    try {
      const parsedItems = JSON.parse(rawItems);
      return Array.isArray(parsedItems) ? parsedItems : null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

const toPositiveNumber = (value) => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const logCreateOrderDebug = (label, value) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[createOrder] ${label}:`, value);
  }
};

const createOrder = async (req, res, next) => {
  try {
    // Debug the incoming payload to quickly verify that frontend really sends items.
    logCreateOrderDebug('req.body', req.body);

    // Support a few common frontend field names so the endpoint is less fragile.
    const items = normalizeItemsPayload(req.body.items);
    const userId = req.user?.id || req.body.userId;
    const deliveryAddress = req.body.deliveryAddress || req.body.address;
    const phoneNumber = req.body.phoneNumber || req.body.phone;
    const customerName = req.body.customerName || req.body.name;
    const paymentMethod = req.body.paymentMethod || 'cash';
    const specialInstructions = req.body.specialInstructions;
    const shippingFee = Number.parseFloat(req.body.shippingFee || 0) || 0;
    const clientTotalPrice = Number.parseFloat(req.body.totalPrice || 0) || 0;

    logCreateOrderDebug('items', items);

    if (!userId) {
      throw createHttpError(401, 'Authentication required to create order');
    }

    if (!items || items.length === 0) {
      throw createHttpError(400, 'Order must have at least one item');
    }

    if (!deliveryAddress || !phoneNumber || !customerName) {
      throw createHttpError(400, 'Delivery address, phone number, and customer name are required');
    }

    const createdOrder = await sequelize.transaction(async (transaction) => {
      // Step 1: validate and normalize every item before creating anything.
      const normalizedItems = await Promise.all(items.map(async (item, index) => {
        const productId = Number.parseInt(item.productId, 10);
        const quantity = Number.parseInt(item.quantity, 10);

        if (!Number.isInteger(productId) || productId <= 0) {
          throw createHttpError(400, `Invalid productId at items[${index}]`);
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw createHttpError(400, `Invalid quantity at items[${index}]`);
        }

        const product = await Product.findByPk(productId, { transaction });

        if (!product) {
          throw createHttpError(400, `Product ${productId} does not exist`);
        }

        if (!product.isAvailable) {
          throw createHttpError(400, `Product ${productId} is currently unavailable`);
        }

        // Prefer authoritative product price from database.
        // If frontend also sends price, we only use it for debug comparison.
        let unitPrice = Number.parseFloat(product.price);
        const requestedSize = item.size || 'medium';
        const requestedToppings = Array.isArray(item.toppings) ? item.toppings : [];
        const clientUnitPrice = toPositiveNumber(item.price);

        if (requestedSize === 'large') unitPrice *= 1.5;
        else if (requestedSize === 'small') unitPrice *= 0.8;

        if (requestedToppings.length > 0) {
          unitPrice += requestedToppings.length * 20000;
        }

        if (clientUnitPrice && process.env.NODE_ENV !== 'production' && Math.abs(clientUnitPrice - unitPrice) > 1) {
          console.warn(
            `[createOrder] price mismatch at items[${index}] - client: ${clientUnitPrice}, server: ${unitPrice}`
          );
        }

        return {
          productId,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          size: requestedSize,
          toppings: requestedToppings,
          productName: product.name,
          productDescription: product.description
        };
      }));

      const itemsSubtotal = normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = itemsSubtotal + shippingFee;

      if (
        clientTotalPrice > 0 &&
        process.env.NODE_ENV !== 'production' &&
        Math.abs(clientTotalPrice - totalAmount) > 1
      ) {
        console.warn(`[createOrder] totalPrice mismatch - client: ${clientTotalPrice}, server: ${totalAmount}`);
      }

      // Step 2: create the parent order first so we get a valid orderId foreign key.
      const order = await Order.create({
        userId,
        totalAmount,
        deliveryAddress: deliveryAddress.trim(),
        phoneNumber: phoneNumber.trim(),
        customerName: customerName.trim(),
        paymentMethod,
        specialInstructions: specialInstructions?.trim()
      }, { transaction });

      logCreateOrderDebug('created order id', order.id);

      // Step 3: insert all order_items with the newly created orderId.
      const createdItems = await Promise.all(normalizedItems.map((item) => (
        OrderItem.create(
          {
            ...item,
            orderId: order.id
          },
          { transaction }
        )
      )));

      logCreateOrderDebug('created order_items count', createdItems.length);

      // Step 4: fetch back the complete order so the response includes both order + order_items.
      return Order.findByPk(order.id, {
        transaction,
        include: [
          { model: OrderItem, as: 'items' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: createdOrder }
    });
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
