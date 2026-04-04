# 🔌 Pizza Ordering System - API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@pizza.com",
  "password": "user123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 3,
      "name": "Test User",
      "email": "user@pizza.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get User Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-04-04T10:00:00Z"
    }
  }
}
```

### Update User Profile (Protected)
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "John Updated",
  "email": "john.new@example.com"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

## 🍕 Product Endpoints

### Get All Products (Public)
```http
GET /products
Optional Query Parameters:
  ?category=meat
  ?category=vegetarian
  ?available=true

Response (200):
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic pizza with fresh tomatoes...",
        "price": "12.99",
        "category": "vegetarian",
        "image": "/images/margherita.jpg",
        "isAvailable": true,
        "createdAt": "2026-04-04T10:00:00Z"
      },
      ...
    ]
  }
}
```

### Get Product by ID (Public)
```http
GET /products/{id}

Response (200):
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Margherita Pizza",
      ...
    }
  }
}
```

### Get Products by Category (Public)
```http
GET /products/category/{category}

Example:
GET /products/category/meat

Response (200):
{
  "success": true,
  "data": {
    "products": [ ... ]
  }
}
```

### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "name": "BBQ Chicken Pizza",
  "description": "Grilled chicken with BBQ sauce",
  "price": 16.99,
  "category": "meat",
  "image": "/images/bbq.jpg",
  "isAvailable": true
}

Response (201):
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 5,
      "name": "BBQ Chicken Pizza",
      ...
    }
  }
}
```

### Update Product (Admin Only)
```http
PUT /products/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "price": 17.99,
  "isAvailable": false
}

Response (200):
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { ... }
  }
}
```

### Delete Product (Admin Only)
```http
DELETE /products/{id}
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📦 Order Endpoints

### Create Order (User - Protected)
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "size": "large",
      "toppings": ["extra cheese", "bacon"]
    },
    {
      "productId": 2,
      "quantity": 1,
      "size": "medium"
    }
  ],
  "customerName": "John Doe",
  "phoneNumber": "555-1234",
  "deliveryAddress": "123 Main St, City",
  "paymentMethod": "card",
  "specialInstructions": "Extra sauce on the side"
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "userId": 3,
      "totalAmount": "65.97",
      "status": "pending",
      "customerName": "John Doe",
      "phoneNumber": "555-1234",
      "deliveryAddress": "123 Main St, City",
      "paymentMethod": "card",
      "specialInstructions": "Extra sauce on the side",
      "createdAt": "2026-04-04T10:00:00Z"
    }
  }
}
```

### Get All Orders (Admin Only)
```http
GET /orders
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "userId": 3,
        "totalAmount": "65.97",
        "status": "pending",
        "customerName": "John Doe",
        "phoneNumber": "555-1234",
        "deliveryAddress": "123 Main St, City",
        "User": {
          "id": 3,
          "name": "Test User",
          "email": "user@pizza.com"
        },
        "OrderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 2,
            "unitPrice": "12.99",
            "totalPrice": "25.98",
            "size": "large",
            "toppings": ["extra cheese"]
          }
        ]
      }
    ]
  }
}
```

### Get User's Orders (User - Protected)
```http
GET /orders/my-orders
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "orders": [ ... ]
  }
}
```

### Get Order by ID (Protected)
```http
GET /orders/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "userId": 3,
      "totalAmount": "65.97",
      "status": "pending",
      ...
    }
  }
}
```

### Update Order Status (Admin Only)
```http
PUT /orders/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Request Body:
{
  "status": "preparing",
  "deliveryTime": "2026-04-04T11:00:00Z"
}

Response (200):
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": 1,
      "status": "preparing",
      "deliveryTime": "2026-04-04T11:00:00Z",
      ...
    }
  }
}
```

---

## ✅ Health Check

### Server Health
```http
GET /health

Response (200):
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-04-04T10:00:00Z",
  "uptime": 3600.5
}
```

### Root Endpoint
```http
GET /

Response (200):
{
  "success": true,
  "message": "Pizza Ordering API is running...",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "orders": "/api/orders",
    "inventory": "/api/inventory"
  }
}
```

---

## 🔄 Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 🔑 Authentication

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- Default: 7 days
- Format: JWT (JSON Web Token)

---

## 📊 Order Status Values

```javascript
Status Options:
- "pending"    - Order received, awaiting preparation
- "preparing"  - Kitchen preparing the order
- "delivering" - Out for delivery
- "completed"  - Order delivered
- "cancelled"  - Order cancelled
```

---

## 🏷️ Product Category Values

```javascript
Categories:
- "meat"         - Meat pizzas (Pepperoni, BBQ Chicken, etc.)
- "vegetarian"   - Vegetarian pizzas (Margherita, Veggie Supreme)
```

---

## 📋 Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Errors

**Missing Token**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Invalid Token**
```json
{
  "success": false,
  "message": "Invalid token."
}
```

**Insufficient Permissions**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**Resource Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 🧪 Sample cURL Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pizza.com",
    "password": "admin123"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Filter by Category
```bash
curl http://localhost:5000/api/products?category=meat
```

### Get All Orders (Requires Token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/orders
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quattro Formaggio",
    "description": "Four cheese pizza",
    "price": 15.99,
    "category": "vegetarian",
    "image": "/images/quartoformage.jpg",
    "isAvailable": true
  }'
```

---

## 🎯 Integration Example (JavaScript/Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({ baseURL: API_URL });

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Login
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data.data;
  localStorage.setItem('token', token);
  return response.data;
}

// Example: Get Products
async function getProducts() {
  const response = await api.get('/products');
  return response.data.data.products;
}

// Example: Create Order (Protected)
async function createOrder(orderData) {
  const response = await api.post('/orders', orderData);
  return response.data.data.order;
}
```

---

## 📞 Support

For issues or questions about API endpoints:
1. Check the TESTING_GUIDE.md for common issues
2. Verify your request format matches examples above
3. Check that your token is valid (not expired)
4. Verify you have necessary permissions for admin endpoints

---

*API Documentation v1.0*
*Last Updated: 2026-04-04*