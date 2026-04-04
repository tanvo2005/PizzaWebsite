# Pizza Ordering System - Backend API

Backend API cho hệ thống đặt bánh Pizza được xây dựng bằng Node.js, Express.js, và MySQL với Sequelize ORM.

## 🚀 Tính năng

- **Authentication**: Đăng ký, đăng nhập với JWT
- **Product Management**: CRUD sản phẩm pizza
- **Order Management**: Tạo và quản lý đơn hàng
- **Inventory Management**: Quản lý kho nguyên liệu
- **Role-based Access**: Phân quyền user/admin
- **Error Handling**: Xử lý lỗi tập trung
- **Database Relations**: Quan hệ giữa các bảng

## 🛠️ Công nghệ sử dụng

- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM cho MySQL
- **JWT** - JSON Web Tokens cho authentication
- **bcryptjs** - Hash passwords
- **CORS** - Cross-Origin Resource Sharing

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Cấu hình database
│   ├── controllers/
│   │   ├── AuthController.js      # Xử lý auth
│   │   ├── ProductController.js   # Xử lý sản phẩm
│   │   ├── OrderController.js     # Xử lý đơn hàng
│   │   └── InventoryController.js # Xử lý kho
│   ├── middleware/
│   │   ├── auth.js                # JWT middleware
│   │   └── errorHandler.js        # Error handler
│   ├── models/
│   │   ├── User.js                # Model User
│   │   ├── Product.js             # Model Product
│   │   ├── Order.js               # Model Order
│   │   ├── OrderItem.js           # Model OrderItem
│   │   ├── Inventory.js           # Model Inventory
│   │   └── index.js               # Export models & associations
│   └── routes/
│       ├── auth.js                # Auth routes
│       ├── products.js            # Product routes
│       ├── orders.js              # Order routes
│       └── inventory.js           # Inventory routes
├── .env                      # Environment variables
├── server.js                 # Server startup
├── app.js                    # Main app
└── package.json              # Dependencies
```

## ⚙️ Cài đặt

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình database:**
   - Tạo database MySQL tên `pizza_app`
   - Cập nhật thông tin database trong `.env`

3. **Chạy migration (tạo bảng):**
   ```bash
   npm run db:sync
   ```

4. **Chạy server:**
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

## 🔧 Environment Variables

Tạo file `.env` trong thư mục backend:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pizza_app
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Bcrypt
BCRYPT_ROUNDS=10
```

## 📊 Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (user/admin)
- timestamps

### Products Table
- id (Primary Key)
- name
- description
- price
- image
- category (vegetarian/meat/vegan/special)
- isAvailable
- ingredients (JSON)
- timestamps

### Orders Table
- id (Primary Key)
- userId (Foreign Key)
- totalAmount
- status (pending/confirmed/preparing/ready/delivered/cancelled)
- deliveryAddress
- phoneNumber
- customerName
- paymentMethod
- paymentStatus
- orderTime
- deliveryTime
- specialInstructions
- timestamps

### Order_Items Table
- id (Primary Key)
- orderId (Foreign Key)
- productId (Foreign Key)
- quantity
- unitPrice
- totalPrice
- size (small/medium/large)
- toppings (JSON)
- productName (snapshot)
- productDescription (snapshot)
- timestamps

### Inventory Table
- id (Primary Key)
- itemName (Unique)
- quantity
- unit
- minThreshold
- maxCapacity
- supplier
- lastRestocked
- expiryDate
- isActive
- timestamps

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy profile
- `PUT /api/auth/profile` - Cập nhật profile

### Products
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `GET /api/products/category/:category` - Lấy sản phẩm theo category
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/my-orders` - Lấy đơn hàng của user
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái (Admin)

### Inventory
- `GET /api/inventory` - Lấy tất cả item kho
- `GET /api/inventory/report` - Báo cáo kho
- `GET /api/inventory/:id` - Lấy item theo ID
- `POST /api/inventory` - Tạo item mới
- `PUT /api/inventory/:id` - Cập nhật item
- `PUT /api/inventory/:id/restock` - Nhập thêm nguyên liệu
- `DELETE /api/inventory/:id` - Xóa item

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication:

1. **Đăng ký/Đăng nhập** để nhận JWT token
2. **Gửi token** trong header: `Authorization: Bearer <token>`
3. **Middleware verifyToken** kiểm tra token
4. **Middleware authorizeRole** kiểm tra quyền (user/admin)

## 🧪 Testing API

Sử dụng tools như Postman hoặc curl để test API:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📝 Logs & Debugging

- Server logs được hiển thị trong console
- Error logs bao gồm stack trace trong development mode
- Database connection status được log khi khởi động

## 🚀 Deployment

1. Đảm bảo MySQL database đã được setup
2. Cập nhật `.env` với production values
3. Chạy `npm run db:sync` để tạo/sync database
4. Chạy `npm start` để start server

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

ISC License