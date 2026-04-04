// routes/auth.js - Authentication Routes
// Định nghĩa các routes cho authentication

const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/AuthController');
const { verifyToken } = require('../middleware/auth');

// Route đăng ký (public)
router.post('/register', register);

// Route đăng nhập (public)
router.post('/login', login);

// Route lấy profile (protected)
router.get('/profile', verifyToken, getProfile);

// Route cập nhật profile (protected)
router.put('/profile', verifyToken, updateProfile);

module.exports = router;