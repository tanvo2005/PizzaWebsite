// controllers/AuthController.js - Authentication Controller
// Xử lý các API liên quan đến authentication: register, login, profile

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Đăng ký tài khoản mới
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Tạo user mới (password sẽ được hash tự động trong model hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Sẽ được hash trong beforeCreate hook
      role: 'user' // Mặc định role user
    });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Trả về thông tin user và token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    next(error); // Chuyển lỗi cho error handler
  }
};

// Đăng nhập
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Trả về thông tin user và token
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// Lấy thông tin profile (yêu cầu authentication)
const getProfile = async (req, res, next) => {
  try {
    // req.user đã được set bởi middleware verifyToken
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Loại bỏ password
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    next(error);
  }
};

// Cập nhật profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'At least name or email must be provided'
      });
    }

    // Kiểm tra email unique nếu có thay đổi
    if (email) {
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase().trim() }
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Cập nhật user
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    await User.update(updateData, { where: { id: userId } });

    // Lấy user đã cập nhật
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};