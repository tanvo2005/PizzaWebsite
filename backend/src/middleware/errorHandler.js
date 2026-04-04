// middleware/errorHandler.js - Global Error Handler
// Middleware này xử lý tất cả lỗi tập trung trong ứng dụng

const errorHandler = (err, req, res, next) => {
  // Log lỗi để debug
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Xử lý các loại lỗi cụ thể
  if (err.name === 'SequelizeValidationError') {
    // Lỗi validation từ Sequelize
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    // Lỗi duplicate key
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry',
      error: err.errors[0]?.message || 'Data already exists'
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    // Lỗi foreign key
    return res.status(400).json({
      success: false,
      message: 'Invalid reference',
      error: 'Referenced data does not exist'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    // Lỗi JWT
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Lỗi mặc định
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Chỉ show stack trong dev
  });
};

module.exports = errorHandler;