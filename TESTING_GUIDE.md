# 🍕 Pizza Ordering System - Complete Setup Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Test Accounts](#test-accounts)
4. [API Endpoints](#api-endpoints)
5. [Testing Workflow](#testing-workflow)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

**Tech Stack:**
- **Frontend**: ReactJS + Vite + Axios + Context API
- **Backend**: Node.js + Express + MySQL + Sequelize
- **Authentication**: JWT + bcryptjs
- **Database**: MySQL with predefined schema

**Features:**
- ✅ User Authentication (Register/Login)
- ✅ Role-based Access Control (User/Admin)
- ✅ Product Management (CRUD)
- ✅ Order Management (Create, View, Update)
- ✅ Protected Routes
- ✅ Modern Admin Dashboard

---

## 🚀 Quick Start

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
# Expected: Server running on port 5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
# Expected: Frontend running on port 5175
```

---

## 👥 Test Accounts

### Admin Account
- **Email**: `admin@pizza.com`
- **Password**: `admin123`
- **Role**: admin

### Regular User Account
- **Email**: `user@pizza.com`
- **Password**: `user123`
- **Role**: user

### Create New Account
- Use the Registration page

---

## 🔌 API Endpoints

### Authentication Routes
```
POST   /api/auth/register      # Create new user
POST   /api/auth/login         # Login user
GET    /api/auth/profile       # Get user profile (protected)
PUT    /api/auth/profile       # Update profile (protected)
```

### Product Routes
```
GET    /api/products           # Get all products (public)
GET    /api/products/:id       # Get product by ID (public)
POST   /api/products           # Create product (admin only)
PUT    /api/products/:id       # Update product (admin only)
DELETE /api/products/:id       # Delete product (admin only)
```

### Order Routes
```
POST   /api/orders             # Create order (user)
GET    /api/orders             # Get all orders (admin only)
GET    /api/orders/:id         # Get order details (user)
GET    /api/orders/my-orders   # Get user's orders (user)
PUT    /api/orders/:id         # Update order status (admin only)
```

---

## 🧪 Testing Workflow

### 1️⃣ Test User Registration
1. Go to http://localhost:5175/register
2. Fill form:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Confirm: `password123`
3. Click Register
4. ✅ Should auto-login and redirect to home

### 2️⃣ Test User Login
1. Click Logout (if needed)
2. Go to http://localhost:5175/login
3. Use credentials:
   - Email: `user@pizza.com`
   - Password: `user123`
4. ✅ Should login and show welcome message

### 3️⃣ Test Menu (View Products)
1. Click "Menu" in navbar
2. ✅ Should display 4 pizza products from database
3. Test filters:
   - Click "All" - shows all products
   - Click "Meat" - shows only meat pizzas
   - Click "Vegetarian" - shows only vegetarian pizzas

### 4️⃣ Test Admin Dashboard
1. Logout
2. Login with admin account:
   - Email: `admin@pizza.com`
   - Password: `admin123`
3. Click "Admin" in navbar
4. ✅ Should show dashboard with:
   - Total Products count
   - Total Orders count
   - Total Revenue
   - Links to manage products/orders

### 5️⃣ Test Admin Product Management
1. From Admin Dashboard, click "Product Management"
2. Or go directly to http://localhost:5175/admin/products
3. ✅ Should see table with current products

**Test Add Product:**
- Click "+ Add Product" button
- Fill form:
  - Name: `BBQ Chicken`
  - Description: `Grilled chicken with BBQ sauce`
  - Price: `16.99`
  - Category: `meat`
  - Image: `/images/bbq.jpg`
- Click "Create Product"
- ✅ Product should appear in table

**Test Edit Product:**
- Click "✎ Edit" button on any product
- Change price to `17.99`
- Click "Update Product"
- ✅ Product should update in table

**Test Delete Product:**
- Click "🗑 Delete" button
- Confirm deletion
- ✅ Product should disappear from table

### 6️⃣ Test Admin Order Management
1. From Admin Dashboard, click "Order Management"
2. Or go directly to http://localhost:5175/admin/orders
3. ✅ Should see empty table initially

**Test View Order Details:**
- (After orders are created by users)
- Click "👁 View Details" button
- ✅ Should show:
  - Customer information
  - Order items
  - Order summary

**Test Update Order Status:**
- Change status dropdown:
  - Pending → Preparing
  - Preparing → Delivering
  - Delivering → Completed
- ✅ Status should update in real-time

### 7️⃣ Test Protected Routes
1. Logout completely
2. Try to access http://localhost:5175/admin
3. ✅ Should redirect to /login

**Test Role-based Access:**
1. Login as regular user
2. Try to access http://localhost:5175/admin/products
3. ✅ Should redirect to /home (insufficient permissions)

---

## 🐛 Troubleshooting

### Issue: Menu page shows "Failed to load products"
**Solution:**
- Check backend is running: `npm run dev` in backend folder
- Check API URL in `.env` is correct: `VITE_API_URL=http://localhost:5000/api`
- Check browser console for CORS errors

### Issue: Can't login after successful registration
**Solution:**
- Check MongoDB/MySQL connection
- Clear localStorage and cookies
- Try login with test accounts

### Issue: Admin pages return 403 Forbidden
**Solution:**
- Make sure you're logged in as admin account
- Check JWT token in localStorage (Open DevTools > Application)
- Verify Authorization header is being sent

### Issue: Can't create/edit products
**Solution:**
- Check you're logged in as admin
- Check browser console for API errors
- Verify product form is filled completely

### Issue: CORS Error
**Solution:**
- Backend already has CORS enabled
- Restart backend server
- Check frontend URL is http (not https)

### Issue: Database shows no products
**Solution:**
- Run seed script to populate database
- Windows:
  ```bash
  cd backend
  node -e "require('./seed.js')"
  ```

---

## 📊 Database Schema

### Users Table
- `id` (PK)
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (user/admin)
- `createdAt, updatedAt`

### Products Table
- `id` (PK)
- `name`
- `description`
- `price`
- `category` (meat/vegetarian)
- `image`
- `isAvailable`
- `createdAt, updatedAt`

### Orders Table
- `id` (PK)
- `userId` (FK)
- `totalAmount`
- `status` (pending/preparing/delivering/completed/cancelled)
- `customerName`
- `phoneNumber`
- `deliveryAddress`
- `paymentMethod`
- `specialInstructions`
- `deliveryTime`
- `createdAt, updatedAt`

### OrderItems Table
- `id` (PK)
- `orderId` (FK)
- `productId` (FK)
- `quantity`
- `unitPrice`
- `totalPrice`
- `size`
- `toppings` (JSON)
- `createdAt, updatedAt`

---

## 📁 Project Structure

```
pizzaApp/
├── backend/
│   ├── src/
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & error handling
│   │   ├── config/          # Database config
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server startup
│   ├── seed.js              # Database seeding
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── context/         # Auth & Cart context
    │   ├── utils/           # API utilities
    │   ├── services/        # API services
    │   └── App.jsx          # Main app
    ├── .env                 # Environment variables
    └── package.json
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5175
- [ ] Can register new user
- [ ] Can login with admin account
- [ ] Menu displays products from API
- [ ] Can view Admin Dashboard
- [ ] Can CRUD products in admin panel
- [ ] Can view and update orders
- [ ] Protected routes redirect correctly
- [ ] All buttons and forms work

---

## 🎓 Key Features Implemented

### Frontend
- ✅ Responsive UI with modern design
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling with user feedback
- ✅ JWT token management
- ✅ Axios interceptors for auth
- ✅ Protected routes with role checking
- ✅ Admin dashboard with stats
- ✅ Product and Order management UI

### Backend
- ✅ RESTful API with proper status codes
- ✅ JWT authentication middleware
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Error handling
- ✅ Database transactions for orders
- ✅ CORS enabled
- ✅ Environment variables

---

## 🔐 Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ Protected routes on frontend & backend
- ✅ CORS configuration
- ✅ Input validation on both sides
- ✅ HTTP-only cookies support ready

---

## 📝 Notes

- Default test accounts are seeded automatically
- Products are seeded with 4 sample pizzas
- All timestamps are automatically managed
- JWT expires in 7 days
- Images are currently placeholder URLs
- Cart functionality (next phase)

---

**Happy Testing! 🚀**