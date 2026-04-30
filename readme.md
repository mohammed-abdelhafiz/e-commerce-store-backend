# 🚀 E-Commerce Backend API

A robust, scalable, and high-performance backend built with **Node.js**, **Express**, and **MongoDB**. This API powers a modern e-commerce platform with features like real-time analytics, secure payments via Stripe, and persistent caching with Redis.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (TypeScript)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Caching**: [Redis](https://redis.io/) (Refresh tokens & featured products)
- **Authentication**: JWT with HttpOnly Cookies & Refresh Token rotation
- **Payments**: [Stripe API](https://stripe.com/) with idempotent processing
- **File Storage**: [Cloudinary](https://cloudinary.com/) (Product images)
- **Validation**: [Zod](https://zod.dev/)

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based auth with refresh token rotation stored in Redis for security and persistence.
- **📦 Product Management**: Full CRUD with Cloudinary integration. Supported categories: `Jeans`, `T-shirts`, `Shoes`, `Glasses`, `Jackets`, `Suits`, `Bags`.
- **🛒 Cart System**: Robust shopping cart logic with persistent database storage.
- **🎟️ Coupon System**: Automatic coupon generation for high-value orders ($100+).
- **💳 Stripe Integration**: Atomic checkout success handling using MongoDB transactions to prevent duplicate orders.
- **📊 Admin Analytics**: Real-time sales data and revenue tracking.
- **⚡ Performance**: Redis caching for featured products with automatic cache invalidation on updates.

## 📁 Project Structure

```text
src/
├── modules/          # Feature-based modules
│   ├── analytics/    # Sales & revenue tracking
│   ├── auth/         # Authentication logic
│   ├── cart/         # Shopping cart management
│   ├── coupons/      # Discount & coupon codes
│   ├── orders/       # Order processing
│   ├── payment/      # Stripe integration
│   └── products/     # Catalog management
├── shared/           # Common utilities, middlewares, and constants
├── app.ts            # Express app configuration
├── routes.ts         # Main router entry point
└── server.ts         # Server entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local instance
- Redis instance
- Stripe Account
- Cloudinary Account

### Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**: Create a `.env` file in the root and fill in the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLIENT_URL=http://localhost:3000
   ```

### Running the App

- **Development**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Production**:
  ```bash
  npm start
  ```

## 📜 License

Distributed under the MIT License.
