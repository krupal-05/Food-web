# FoodX - Hyperlocal Food Discovery & Delivery Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js%20v20+-green.svg)
![Express.js](https://img.shields.io/badge/Framework-Express%20v5-black.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8.svg)
![License](https://img.shields.io/badge/License-ISC-orange.svg)

**FoodX** is a modern, full-stack, hyperlocal food discovery and logistics fulfillment platform inspired by premier benchmarks like **Swiggy** and **Zomato**. It connects hungry consumers with verified restaurants and a dedicated fleet of delivery riders, featuring a **Kitchen Display System (KDS)** for merchant partners, **Real-Time GPS Courier Milestones**, and **3-Tier Role-Based Access Control (RBAC)**.

---

## 🌟 Key Highlights & Ecosystem Features

### 👤 1. Consumer Discovery & Delivery (Swiggy / Zomato Benchmarks)
- **Interactive Location Selector**: Live address dropdown with GPS pin for quick switching between *Home*, *Work*, and custom locations.
- **Animated Search Bar**: Auto-cycling placeholder showcasing popular dishes (*Biryani*, *Burgers*, *Pizzas*, *Desserts*).
- **"What's on your mind?" Stories**: High-res circular dish category avatars with 1-tap filtering.
- **Curated Restaurant Cards**: Floating discount ribbons (*"60% OFF UPTO ₹120"*), verified emerald star ratings, ETA, and price for two.
- **Dish Customisation Drawer**: Choose portion sizes (*Regular* vs. *Large Handi*) and add-on accompaniments (*Burani Raita*, *Mirchi Ka Salan*).
- **Floating Bottom Cart Bar**: Sleek sticky drawer that surfaces item counts and 1-tap checkout triggers.
- **Delivery Rider Tipping & Eco-Options**: Tip buttons (₹20, ₹30, ₹50) with 100% rider proceeds, No-Contact Delivery, and plastic cutlery opt-out.
- **Itemized Invoice & Promo Coupons**: Item totals, packaging fee, delivery fee (Free > ₹299), GST (5%), platform fees, and coupon savings (`FOODX50`).
- **Live Courier Tracking & Milestones**: Live bike GPS progress simulation, delivery rider profile (*Vikram Sharma*), handover OTP (`4829`), call hotline, and **120-second grace cancellation**.
- **Customer Feedback & Ratings**: Verified 1-to-5 star restaurant reviews and testimonials.

### 🍳 2. Restaurant Partner Suite (Merchant Portal)
- **Live Kitchen Display System (KDS)**: Real-time ticket management stream with incoming order audio chime simulation.
- **1-Tap Order Progression**: Transition orders seamlessly from `pending` ➔ `preparing` (cooking) ➔ `ready` (packed) ➔ `out_for_delivery` (rider handover).
- **Dish Inventory & Stock Control**: Instant 86ing (1-tap out-of-stock toggle) for sold-out menu items.
- **Menu Publisher**: Add new food items with prices, categories, dietary badges, and image assets.
- **Outlet Operations**: Operating hours, FSSAI license compliance, support contact, and settlement bank accounts.

### 🛡️ 3. Super Admin Governance Console
- **Platform GMV Telemetry**: Real-time Gross Merchandise Value tracking and 20% platform commission cut calculations.
- **Global Order Stream**: Platform-wide transaction audits across all restaurants and hubs.
- **System Health Monitor**: Live database and API service status verification.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Backend Capability | Customer | Restaurant Partner | Super Admin | Backend Endpoint / Middleware |
| :--- | :---: | :---: | :---: | :--- |
| **Browse Kitchens & Dishes** | ✅ | ✅ | ✅ | `GET /api/v1/restaurants`, `GET /api/v1/foods` |
| **Manage Cart & Checkout** | ✅ | ❌ | ✅ | `GET/POST /api/v1/cart`, `POST /api/v1/orders` |
| **Post Restaurant Reviews** | ✅ | ❌ | ✅ | `POST /api/v1/reviews` (`verifyJwt`) |
| **Cancel Order (Grace Period)** | ✅ | ❌ | ✅ | `PUT /api/v1/orders/:id/cancel` (`verifyJwt`) |
| **Live Kitchen KDS Tickets** | ❌ | ✅ | ✅ | `GET /api/v1/orders/owner/restaurant-orders` (`verifyOwnerOrAdmin`) |
| **Advance Order Prep Status** | ❌ | ✅ | ✅ | `PUT /api/v1/orders/:id/status` (`verifyOwnerOrAdmin`) |
| **Add / Edit Menu Dishes** | ❌ | ✅ | ✅ | `POST/PUT /api/v1/foods` (`verifyOwnerOrAdmin`) |
| **Register / Edit Restaurant** | ❌ | ✅ | ✅ | `POST/PUT /api/v1/restaurants` (`verifyOwnerOrAdmin`) |
| **Platform GMV & Global Orders** | ❌ | ❌ | ✅ | `GET /api/v1/orders/admin/all` (`verifyAdmin`) |

---

## 🛠️ Tech Stack & Architecture

```
FoodX Application
├── Frontend (Client SPA)
│   ├── React 19 + Vite 8
│   ├── Tailwind CSS v4 (@tailwindcss/vite)
│   ├── Lucide React Icons
│   ├── Canvas Confetti
│   └── Context API State Management
└── Backend (REST API Server)
    ├── Node.js + Express 5
    ├── MongoDB + Mongoose 9
    ├── JWT Authentication (Access + Refresh Tokens)
    ├── Bcrypt Password Hashing
    ├── Multer + Cloudinary Media Storage
    └── Cookie-Parser & CORS
```

---

## 📡 REST API Reference

### 1. Authentication & User Profile (`/api/v1/users`)
- `POST /register` — Register a new account (`firstName`, `lastName`, `email`, `phone`, `password`, `role`, `address`).
- `POST /login` — Authenticate user and receive access + refresh tokens.
- `POST /logout` — Invalidate session and clear auth cookies.
- `GET /profile` — Retrieve current user profile (`verifyJwt`).
- `PUT /profile` — Update address, telephone, and details (`verifyJwt`).
- `PUT /change-password` — Change password (`oldPassword`, `newPassword`).

### 2. Restaurants (`/api/v1/restaurants`)
- `GET /` — List open restaurants with filters (`search`, `cuisine`, `city`, `sort`).
- `GET /:id` — Get single restaurant profile & operating details.
- `POST /register` — Register restaurant partner outlet (`verifyOwnerOrAdmin`).
- `GET /owner/my-restaurants` — Get restaurants owned by logged-in merchant.
- `PUT /:id` — Update restaurant details (`verifyOwnerOrAdmin`).

### 3. Food Catalog (`/api/v1/foods`)
- `GET /` — Browse dishes (`category`, `foodType: 'veg' | 'non-veg'`, `search`).
- `GET /:id` — Get dish details.
- `GET /restaurant/:restaurantId` — Get all dishes for a specific restaurant.
- `POST /` — Create a new dish (`verifyOwnerOrAdmin`).
- `PUT /:id` — Update dish details or toggle stock availability (`verifyOwnerOrAdmin`).
- `DELETE /:id` — Delete dish (`verifyOwnerOrAdmin`).

### 4. Cart (`/api/v1/cart`)
- `GET /` — Retrieve user's active cart with populated dish info.
- `POST /items` — Add dish to cart (`foodId`, `quantity`).
- `PATCH /items` — Update item quantity in cart.
- `DELETE /items/:foodId` — Remove item from cart.
- `DELETE /clear` — Empty cart.

### 5. Orders & Dispatch (`/api/v1/orders`)
- `POST /` — Place new order (`restaurantId`, `items`, `deliveryAddress`, `paymentMethod`, `instructions`).
- `GET /my-orders` — Get consumer order history.
- `GET /:orderId` — Get single order tracking details.
- `PUT /:orderId/cancel` — Cancel order within grace period.
- `GET /owner/restaurant-orders` — Merchant live KDS tickets stream.
- `PUT /:orderId/status` — Advance order state (`pending` ➔ `preparing` ➔ `ready` ➔ `out_for_delivery` ➔ `delivered`).
- `GET /admin/all` — Platform-wide orders & GMV telemetry.

### 6. Reviews & Ratings (`/api/v1/reviews`)
- `GET /restaurant/:restaurantId` — Get reviews and star ratings for a restaurant.
- `POST /` — Post a 1-5 star review with comments (`verifyJwt`).

---

## 📁 Repository Structure

```
Food Web/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB & Cloudinary configuration
│   │   ├── controllers/     # Express route controllers (User, Restaurant, Food, Cart, Order, Review)
│   │   ├── middleware/      # JWT verification, Role authorization, Multer upload
│   │   ├── models/          # Mongoose schemas (User, Restaurant, Food, Cart, Order, Review)
│   │   ├── routers/         # API Route definitions mounted on /api/v1/...
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler helpers
│   │   └── app.js           # Express app setup, CORS, static uploads, error handler
│   ├── index.js             # Server entrypoint listening on port 5000
│   ├── test-backend.js      # Backend verification script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Modular UI views (Navbar, Explore, Restaurant, Cart, Checkout, Orders, Partner, Admin, Profile, RoleGuard, FloatingCartBar)
│   │   ├── context/         # Centralized AppContext for auth, cart, orders, and role state
│   │   ├── services/        # Unified API REST client (api.js)
│   │   ├── mockData.js      # Fallback datasets and initial menu items
│   │   ├── App.jsx          # Master application shell
│   │   ├── index.css        # Tailwind CSS v4 styling & theme tokens
│   │   └── main.jsx         # React DOM entrypoint
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)
- **npm** or **yarn**

---

### Step 1: Clone Repository & Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables in backend/.env
# Example .env configuration:
PORT=5000
MONGODB_URL=mongodb://localhost:27017/foodx_delivery
JWT_ACCESS_SECRET=your_super_secret_access_jwt_key_12345
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_12345
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Verify backend integrity
npm test

# Start backend dev server
npm run dev
```

*Backend server will start listening on `http://localhost:5000`.*

---

### Step 2: Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

*Frontend web application will open at `http://localhost:5173`.*

---

### Step 3: Production Build

```bash
# Build frontend bundle
npm run build

# Preview production build
npm run preview
```

---

## 👥 Demo Personas (1-Tap Switcher)

The application includes a 1-tap persona switcher in the top navigation bar to test each role:

1. **👤 Customer (*Priya Sharma*)**:
   - `email`: `priya.sharma@example.com` | `password`: `password123`
   - Access: Consumer discovery, restaurant menus, cart, checkout, live tracking, and reviews.
2. **🍳 Restaurant Merchant (*Rajesh Gupta*)**:
   - `email`: `rajesh@biryanikilo.com` | `password`: `password123`
   - Access: Kitchen KDS ticket dispatch, instant dish out-of-stock toggles, and menu publishing.
3. **🛡️ Super Admin (*Anita Deshmukh*)**:
   - `email`: `anita.ops@foodx.com` | `password`: `password123`
   - Access: Full platform overview, Gross GMV analytics, 20% platform revenue cut, and universal oversight.

---

## 📄 License
This project is licensed under the **ISC License**.
