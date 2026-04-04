// models/User.js - User Model
// Định nghĩa model User cho bảng users trong database
// Model này đại diện cho người dùng của hệ thống (khách hàng và admin)

const { DataTypes } = require("sequelize"); // Import DataTypes từ Sequelize
const sequelize = require("../config/db"); // Import kết nối database
const bcrypt = require("bcryptjs"); // Import bcrypt để hash password

// Định nghĩa model User
const User = sequelize.define("User", {
  // Trường id: tự động tạo bởi Sequelize (auto-increment primary key)

  name: {
    type: DataTypes.STRING,      // Kiểu dữ liệu: chuỗi
    allowNull: false,            // Không cho phép null
    validate: {
      notEmpty: true,            // Không cho phép chuỗi rỗng
      len: [2, 100]              // Độ dài từ 2-100 ký tự
    }
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                // Email phải unique
    validate: {
      isEmail: true,             // Validate định dạng email
      notEmpty: true
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]              // Password tối thiểu 6 ký tự
    }
  },

  role: {
    type: DataTypes.ENUM('user', 'admin'), // Chỉ cho phép 'user' hoặc 'admin'
    defaultValue: 'user',        // Mặc định là 'user'
    allowNull: false
  }
}, {
  // Options cho model
  timestamps: true,              // Tự động thêm createdAt và updatedAt
  hooks: {
    // Hook trước khi tạo user: hash password
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10); // Tạo salt
        user.password = await bcrypt.hash(user.password, salt); // Hash password
      }
    },
    // Hook trước khi update user: hash password nếu có thay đổi
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.checkPassword = async function(password) {
  // Phương thức kiểm tra password
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  // Override toJSON để không trả password khi serialize
  const values = { ...this.get() };
  delete values.password; // Xóa password khỏi response
  return values;
};

module.exports = User; // Export model User