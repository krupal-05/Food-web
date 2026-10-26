# FoodX - Hyperlocal Food Discovery & Delivery Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js%20v20+-green.svg)
![Express.js](https://img.shields.io/badge/Framework-Express%20v5-black.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Mongoose-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8.svg)
![License](https://img.shields.io/badge/License-ISC-orange.svg)

**FoodX** is a modern, enterprise-grade, hyperlocal food delivery and restaurant management system. The platform is architected with a decoupled REST backend and a lightning-fast React 19 single-page application featuring **3 dedicated role portals** (Customer, Restaurant Owner, and Super Admin), **Live Kitchen Fulfillment (KDS)**, **Dynamic Cart & Checkout**, and **Role-Based Access Control (RBAC)**.

---

## 🌟 Architecture & Portals

### 🛒 1. Customer Discovery & Ordering Portal (`/`)
- **Home & Cuisines:** Live category grid, backend-recommended popular dishes, verified partner outlets.
- **Smart Menu & Filtering (`/menu`):** Debounced instant search, dietary tags (Veg, Non-Veg, Vegan), category filters, and rating/price sorting.
- **Restaurant Details (`/restaurant/:id`):** Cover banner, real-time operating hours check (`Open` / `Closed`), dishes catalog, customer reviews, and verified review modal.
- **Cart & Single-Restaurant Guard (`/cart`):** Quantity increments/decrements, automated cart synchronization, and single-restaurant order enforcement.
- **Checkout:** Strict 6-digit Indian PIN code validation (`/^\d{6}$/`), minimum order threshold validation, and payment method selector (Cash on Delivery / Online Card).
- **Order Tracking & Management (`/orders`):** Order history with live status badges (`pending`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `cancelled`) and non-blocking 2-step order cancellation for pending orders.
- **Profile Management (`/profile`):** Personal information, saved delivery address, and password change.

### 👨‍🍳 2. Restaurant Owner Portal (`/owner/*`)
- **Kitchen Dashboard (`/owner/dashboard`):** Real-time kitchen toggle (`Online / Accepting Orders` ↔ `Offline / Kitchen Closed`), live KPI cards (Active Tickets, Total Menu Items, Revenue GMV, Completed Orders), and incoming orders table.
- **Outlet Profile Governance (`/owner/restaurant`):** Register new outlet with Cloudinary/multer image upload, update operating hours, minimum delivery order, address, and pincode.
- **Menu Food CRUD (`/owner/foods`):** Add dish with category, price, veg/non-veg tag, dietary description, and food image; instant stock availability toggle (`In Stock` ↔ `Sold Out`); edit and delete capabilities.
- **Live KDS Fulfillment Queue (`/owner/orders`):** Filter by ticket stage, customer delivery details, and one-click status advancement controls (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Out for Delivery` ➔ `Delivered`).

### 🛡️ 3. Super Admin Portal (`/admin/*`)
- **Dedicated Admin Login (`/admin/login`):** Isolated entrance with strict role verification (`role === 'admin'`).
- **Executive Metrics (`/admin/dashboard`):** Live GMV calculations, verified outlet counts, active user accounts, and platform order volume.
- **User Directory (`/admin/users`):** Complete user directory with instant role filters (`customer`, `restaurantOwner`, `admin`, `deliveryAgent`).
- **Restaurant Governance (`/admin/restaurants`):** Audit all registered restaurants, launch public menus, and perform cascade deletions.
- **Global Food Catalog (`/admin/foods`):** Manage dishes across all restaurants with search and category filtering.
- **Global Order Ledger (`/admin/orders`):** Filter, search, and override order statuses directly when needed.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Portal Route | Minimum Role | Allowed Roles | Guard Component |
| :--- | :--- | :--- | :--- |
| `/` | Public | All | None |
| `/menu` | Public | All | None |
| `/restaurant/:id` | Public | All | None |
| `/cart` | Customer | `customer` | `ProtectedRoute` |
| `/orders` | Customer | `customer` | `ProtectedRoute` |
| `/profile` | Authenticated | All authenticated users | `ProtectedRoute` |
| `/owner/*` | Restaurant Owner | `restaurantOwner` | `RoleRoute` (`allowedRoles={['restaurantOwner']}`) |
| `/admin/*` | Super Admin | `admin` | `RoleRoute` (`allowedRoles={['admin']}`) |

---

## 🛠️ Tech Stack

### Frontend (SPA Client)
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM v7 (Route-level code splitting with `React.lazy()` and `<Suspense>`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **HTTP Client:** Axios (Centralized instance with bearer token interceptor, 401 token refresh queue, and unified error handling)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `ToastContext`)
- **Resilience:** Top-level React `ErrorBoundary`

### Backend (REST API Server)
- **Runtime:** Node.js v20+ with Express 5
- **Database:** MongoDB + Mongoose 9 ODM
- **Authentication:** JWT (Access Token + Refresh Token in HttpOnly Cookies & Bearer headers) + Bcrypt
- **Media Uploads:** Multer with Cloudinary integration
- **Architecture:** Clean MVC pattern (`routers/`, `controllers/`, `models/`, `middleware/`, `utils/`)

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
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI (Button, Input, Badge, Modal, Skeleton, EmptyState, ErrorBoundary)
│   │   │   ├── food/        # FoodCard, RestaurantCard, CategoryCard
│   │   │   └── layout/      # Navbar, Footer
│   │   ├── constants/       # Order status, user roles, API endpoints
│   │   ├── context/         # AuthContext, CartContext, ToastContext
│   │   ├── hooks/           # useAuth, useCart, useToast, useDebounce
│   │   ├── layouts/         # CustomerLayout, OwnerLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/       # AdminDashboard, UserManagement, AdminRestaurants, AdminFoods, AdminOrders
│   │   │   ├── auth/        # LoginPage, RegisterPage, AdminLoginPage
│   │   │   ├── customer/    # HomePage, MenuPage, RestaurantDetailPage, CartPage, OrdersPage, ProfilePage, AboutPage
│   │   │   └── restaurant/  # OwnerDashboard, RestaurantManagement, FoodManagement, OwnerOrders
│   │   ├── routes/          # AppRoutes (lazy-loaded), ProtectedRoute, RoleRoute
│   │   ├── services/        # Centralized Axios API services
│   │   ├── App.jsx          # Root application component with ErrorBoundary & ToastProvider
│   │   ├── index.css        # Tailwind CSS imports & global design tokens
│   │   └── main.jsx         # React DOM entrypoint
│   ├── vite.config.js       # Vite configuration with Tailwind CSS plugin
│   └── package.json
└── README.md
```

---

## 📡 REST API Reference

All backend endpoints are prefixed with `/api/v1`:

### 1. Authentication & Users (`/api/v1/users`)
- `POST /register` — Register new user account (`firstName`, `lastName`, `email`, `phone`, `password`, `role`, `address`)
- `POST /login` — Authenticate and receive JWT tokens
- `POST /logout` — Invalidate session and clear auth cookies
- `POST /refresh-token` — Rotate expired access token using refresh token
- `GET /profile` — Retrieve current authenticated user profile (`verifyJwt`)
- `PUT /profile` — Update name, phone, or address (`verifyJwt`)
- `PUT /change-password` — Change password (`oldPassword`, `newPassword`)
- `GET /` — List all registered platform users (`verifyAdmin`)

### 2. Restaurants (`/api/v1/restaurants`)
- `GET /` — List open restaurants (`search`, `cuisine`, `city`, `sort`)
- `GET /:id` — Get single restaurant profile & operating details
- `POST /register` — Register restaurant partner outlet (`verifyOwnerOrAdmin`)
- `GET /owner/my-restaurants` — Get outlets owned by logged-in merchant (`verifyOwnerOrAdmin`)
- `PUT /:id` — Update restaurant details (`verifyOwnerOrAdmin`)
- `DELETE /:id` — Delete restaurant and cascade food items (`verifyOwnerOrAdmin`)

### 3. Food Catalog (`/api/v1/foods`)
- `GET /` — Browse dishes (`category`, `foodType: 'veg' | 'non-veg'`, `search`)
- `GET /:id` — Get dish details
- `GET /restaurant/:restaurantId` — Get all dishes for a specific restaurant
- `POST /` — Create a new dish (`verifyOwnerOrAdmin`)
- `PUT /:id` — Update dish details or toggle stock availability (`verifyOwnerOrAdmin`)
- `DELETE /:id` — Delete dish (`verifyOwnerOrAdmin`)

### 4. Cart (`/api/v1/cart`)
- `GET /` — Retrieve user's active cart with populated food details
- `POST /items` — Add dish to cart (`foodId`, `quantity`)
- `PATCH /items` — Update item quantity in cart
- `DELETE /items/:foodId` — Remove item from cart
- `DELETE /clear` — Empty cart

### 5. Orders (`/api/v1/orders`)
- `POST /` — Place new order (`restaurantId`, `items`, `deliveryAddress`, `paymentMethod`)
- `GET /my-orders` — Get authenticated customer's order history
- `GET /:orderId` — Get single order tracking details
- `PUT /:orderId/cancel` — Cancel pending order
- `GET /owner/restaurant-orders` — Live KDS tickets stream for restaurant owner
- `PUT /:orderId/status` — Advance order state (`pending` ➔ `preparing` ➔ `ready` ➔ `out_for_delivery` ➔ `delivered`)
- `GET /admin/all` — Platform-wide orders & GMV telemetry

### 6. Reviews & Ratings (`/api/v1/reviews`)
- `GET /restaurant/:restaurantId` — Get reviews and star ratings for a restaurant
- `POST /` — Submit a 1-5 star review with comments (`verifyJwt`)

---

## 🔑 Demo & Test Credentials

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer** | [`http://localhost:5173/login`](http://localhost:5173/login) | `customer1@test.com` | `Password123!` |
| **Restaurant Owner** | [`http://localhost:5173/login`](http://localhost:5173/login) | `owner4@pizzapalace.com` | `Password123!` |
| **Super Admin** | [`http://localhost:5173/admin/login`](http://localhost:5173/admin/login) | `admin@maincraft.com` | `Password123!` |

*Other Seed Restaurant Owners (Password: `Password123!`):*
- `owner1@spicegarden.com` (The Spice Garden)
- `owner2@burgerbeast.com` (Burger Beast)
- `owner3@dragonwok.com` (Dragon Wok)
- `owner5@sweetbitescafé.com` (Sweet Bites Café)

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI)
- **npm**

---

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend dev server
npm start
```

*The backend will run on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

*The frontend application will open on `http://localhost:5173`.*

---

### Step 3: Production Build

```bash
cd frontend
npm run build
```

- **Output:** Built in `dist/` with on-demand chunking (<300kB initial bundle).
- **Compilation:** Zero warnings, zero errors.

---

## 📄 License
This project is licensed under the **ISC License**.
