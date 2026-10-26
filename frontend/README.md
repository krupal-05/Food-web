# FoodX Frontend — Complete Production Documentation

A modern, responsive, high-performance web frontend for the **Food Delivery Management System**, built with React 19, Vite, Tailwind CSS, Lucide Icons, and Axios. Fully integrated with the Node.js/Express/MongoDB backend architecture.

---

## 🌟 Key Highlights & Features

### 🛒 Customer Portal
- **Discovery Engine:** Category filters, search with debounce, top-rated recommendations, and verified restaurant partner cards.
- **Smart Menu:** Dual-axis filtering (Categories + Dietary tags: Veg / Non-Veg / Vegan), price and rating sorting.
- **Restaurant Details & Reviews:** Cover imagery, active business hours check, categorized food listings, customer review carousel, and verified review submission modal.
- **Persistent Cart & Single-Restaurant Guard:** Prevents mixed-cart checkout with intuitive replace/cancel modal.
- **Validated Checkout:** Strict 6-digit Indian PIN code validation (`/^\d{6}$/`), minimum order threshold validation, and payment method selector.
- **Real-Time Order Tracking & Management:** Multi-stage status tracker with non-blocking inline two-step order cancellation for pending tickets.
- **User Profile:** Synchronized profile details, saved address management, and password update.

### 👨‍🍳 Restaurant Owner Portal (`/owner/*`)
- **Live Kitchen Operations (KDS):** Real-time order queue with status progression buttons (`pending` ➔ `preparing` ➔ `ready` ➔ `out_for_delivery` ➔ `delivered`).
- **Kitchen Toggle:** Instantly toggle restaurant status (`Online / Accepting Orders` ↔ `Offline / Kitchen Closed`).
- **Outlet Governance:** Register new restaurant, upload banner images, configure delivery fees, minimum order amounts, and operating hours.
- **Menu Catalog CRUD:** Add dishes with Cloudinary image uploads, dietary tags, category selection, and instant stock toggle (`In Stock` ↔ `Sold Out`).

### 🛡️ Super Admin Portal (`/admin/*`)
- **Dedicated Admin Login:** Isolated entrance with strict role verification (`role === 'admin'`).
- **Executive Metrics:** Live GMV calculations, verified outlet counts, active user accounts, and platform order volume.
- **User Directory:** Filter accounts by role (`customer`, `restaurantOwner`, `admin`, `deliveryAgent`).
- **Restaurant Governance:** Audit platform outlets, launch public storefronts, and manage cascade deletions.
- **Global Food Catalog:** Centralized dish management across all vendors.
- **Global Order Ledger:** Comprehensive order history with direct status override controls.

---

## 🏗️ Project Structure

```
frontend/src/
├── assets/                 # Static media and brand assets
├── components/
│   ├── common/             # Reusable UI library (Button, Input, Badge, Modal, Skeleton, EmptyState, ErrorBoundary)
│   ├── food/               # Domain components (FoodCard, RestaurantCard, CategoryCard)
│   └── layout/             # Universal Layout elements (Navbar, Footer)
├── constants/              # System constants (order statuses, role definitions, categories)
├── context/                # React Context Providers
│   ├── AuthContext.jsx     # Authentication, JWT lifecycle, RBAC
│   ├── CartContext.jsx     # Persistent cart state & validation
│   └── ToastContext.jsx    # Animated notification system
├── hooks/                  # Custom hooks (useAuth, useCart, useToast, useDebounce)
├── layouts/                # Portal shell layouts (CustomerLayout, OwnerLayout, AdminLayout)
├── pages/
│   ├── admin/              # Super Admin views (Dashboard, Users, Restaurants, Foods, Orders)
│   ├── auth/               # Authentication views (Login, Register, AdminLogin)
│   ├── customer/           # Customer views (Home, Menu, RestaurantDetail, Cart, Orders, Profile, About)
│   └── restaurant/         # Owner views (Dashboard, RestaurantManagement, FoodManagement, OwnerOrders)
├── routes/                 # Route guards and router config
│   ├── AppRoutes.jsx       # Lazy-loaded code-split routes with Suspense
│   ├── ProtectedRoute.jsx  # Authentication gate
│   └── RoleRoute.jsx       # RBAC role verification gate
└── services/               # Centralized Axios API service layer
    ├── api.js              # Interceptors, token refresh queue, base config
    ├── auth.service.js     # Auth & profile endpoints
    ├── restaurant.service.js # Restaurant CRUD & status endpoints
    ├── food.service.js     # Food catalog & upload endpoints
    ├── order.service.js    # Order lifecycle & checkout endpoints
    ├── cart.service.js     # Server-side cart operations
    └── review.service.js   # Restaurant review endpoints
```

---

## 🔐 Role-Based Access Control (RBAC) Matrix

| Route | Minimum Role | Allowed Roles | Guard Component |
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

## 🔑 Test Credentials

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| **Customer** | `/login` | `customer1@test.com` | `Password123!` |
| **Restaurant Owner** | `/login` | `owner4@pizzapalace.com` | `Password123!` |
| **Super Admin** | `/admin/login` | `admin@maincraft.com` | `Password123!` |

*Additional Seed Restaurant Owners (Password: `Password123!`):*
- `owner1@spicegarden.com`
- `owner2@burgerbeast.com`
- `owner3@dragonwok.com`
- `owner5@sweetbitescafé.com`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.0.0
- Backend running on `http://localhost:5000`

### 2. Environment Setup
Create a `.env` file in `frontend/` (or copy `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in `dist/` with on-demand chunking (<300kB initial bundle).
