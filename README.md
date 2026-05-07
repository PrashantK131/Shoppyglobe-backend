# 🛍 ShoppyGlobe — E-Commerce Backend API

A complete RESTful backend API for an e-commerce application shoppyglobe built with Node.js, Express.js and MongoDB following MVC architecture with JWT authentication.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Logging | Morgan |
| CORS | cors |
| Dev Tool | Nodemon |

## 📁 Project Structure

```
Shoppyglobe_backend/
├── server.js                  # App entry point
├── .env                       # Environment variables (cannot commit)
├── .gitignore                 # Git ignore rules
├── package.json               # Project metadata and scripts
├── config/
│   └── db.js                  # MongoDB connection setup
├── models/
│   ├── User.js                # User schema (name, email, hashed password)
│   ├── Product.js             # Product schema (name, price, description, stock)
│   └── Cart.js                # Cart schema (userId, products array)
├── controllers/
│   ├── authController.js      # Register and login logic
│   ├── productController.js   # Get all / get single product
│   └── cartController.js      # Add, update, remove cart items
├── routes/
│   ├── authRoutes.js          # POST /auth/register, POST /auth/login
│   ├── productRoutes.js       # GET /products, GET /products/:id
│   └── cartRoutes.js          # POST/PUT/DELETE /cart (protected)
└── middleware/
    ├── authMiddleware.js      # JWT verification — protects cart routes
    ├── errorMiddleware.js     # Centralized error handler
    └── validators.js          # express-validator rules for all routes
```

## ⚙️ Setup Instructions

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd Shoppyglobe_backend
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Environment Variables

```bash
cp .env
```

Create `.env` or Open `.env` if already present and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/shoppyglobe
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRES_IN=7d
```

### Step 4 — Start the Server

```bash
# Development (auto-restarts on file changes)
npm run dev
    OR 
npm start
```

**Expected output:**
```
✅ Server running at http://localhost:5000 [development]
✅ MongoDB Connected: localhost
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Response Format
All responses return consistent JSON:
```json
{
  "success": true,
  "message": "Description of result",
  "data": { }
}
```

---

## 🔐 Authentication Routes

### `POST /auth/register` — Register New User

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### `POST /auth/login` — Login User

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepass123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🛍 Product Routes

### `GET /products` — Get All Products

No authentication required.

**Success Response `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "69fabc9c7cc785b699761611",
      "name": "Wireless Headphones",
      "price": 79.99,
      "description": "Noise-cancelling over-ear headphones",
      "stock": 50
    }
  ]
}
```

---

### `GET /products/:id` — Get Single Product

**URL Example:** `GET /products/69fabc9c7cc785b699761611`

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "69fabc9c7cc785b699761611",
    "name": "Wireless Headphones",
    "price": 79.99,
    "stock": 50
  }
}
```

---

## 🛒 Cart Routes — All Protected (JWT Required)

Add this header to every cart request:
```
Authorization: Bearer <your_token_here>
```

---

### `POST /cart` — Add Product to Cart

**Request Body:**
```json
{
  "productId": "69fabc9c7cc785b699761611",
  "quantity": 2
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Product added to cart.",
  "data": {
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "products": [
      {
        "productId": {
          "_id": "69fabc9c7cc785b699761611",
          "name": "Wireless Headphones",
          "price": 79.99,
          "stock": 50
        },
        "quantity": 2
      }
    ]
  }
}
```

---

### `PUT /cart/:id` — Update Cart Item Quantity

`:id` = the `productId` (not the cart ID)

**URL Example:** `PUT /cart/69fabc9c7cc785b699761611`

**Request Body:**
```json
{
  "quantity": 5
}
```

---

### `DELETE /cart/:id` — Remove Product from Cart

`:id` = the `productId` to remove

**URL Example:** `DELETE /cart/69fabc9c7cc785b699761611`

No request body needed.

## ⚠️ Error Reference

| Status | Meaning | Common Cause |
|---|---|---|
| `400` | Bad Request | Invalid ObjectId format, quantity exceeds stock |
| `401` | Unauthorized | Missing, invalid, or expired JWT token |
| `404` | Not Found | Product, cart, or route doesn't exist |
| `409` | Conflict | Email already registered |
| `422` | Unprocessable | Validation failed — missing fields, wrong format |
| `500` | Internal Server Error | Database error or unhandled exception |

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT tokens expire after **7 days** (configurable via `JWT_EXPIRES_IN`)
- Password field excluded from all DB queries by default (`select: false`)
- All cart routes protected by `protect` middleware
- Input sanitization and validation on every route

## 🧪 Testing with Thunder Client

### Install
VS Code → Extensions (`Ctrl+Shift+X`) → Search **Thunder Client** → Install

### Recommended Test Order

| # | Method | URL | Auth |
|---|---|---|---|
| 1 | POST | `/auth/register` | No |
| 2 | POST | `/auth/login` | No |
| 3 | GET | `/products` | No |
| 4 | GET | `/products/:id` | No |
| 5 | POST | `/cart` | Bearer token |
| 6 | PUT | `/cart/:productId` | Bearer token |
| 7 | DELETE | `/cart/:productId` | Bearer token |

## 📌 Implementation Details 
    - Code is thoroughly commented to explain complex logics.
    - Github Link: [https://github.com/PrashantK131/Shoppyglobe-backend]

## 👨‍💻 Author

[Prashant Kumar]