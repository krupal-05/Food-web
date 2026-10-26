import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import OwnerLayout from '../layouts/OwnerLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

// Route-Level Code Splitting (React.lazy)
const HomePage = lazy(() => import('../pages/customer/HomePage.jsx'));
const MenuPage = lazy(() => import('../pages/customer/MenuPage.jsx'));
const RestaurantDetailPage = lazy(() => import('../pages/customer/RestaurantDetailPage.jsx'));
const AboutPage = lazy(() => import('../pages/customer/AboutPage.jsx'));
const CartPage = lazy(() => import('../pages/customer/CartPage.jsx'));
const OrdersPage = lazy(() => import('../pages/customer/OrdersPage.jsx'));
const ProfilePage = lazy(() => import('../pages/customer/ProfilePage.jsx'));

const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'));
const AdminLoginPage = lazy(() => import('../pages/auth/AdminLoginPage.jsx'));

const OwnerDashboard = lazy(() => import('../pages/restaurant/OwnerDashboard.jsx'));
const RestaurantManagement = lazy(() => import('../pages/restaurant/RestaurantManagement.jsx'));
const FoodManagement = lazy(() => import('../pages/restaurant/FoodManagement.jsx'));
const OwnerOrders = lazy(() => import('../pages/restaurant/OwnerOrders.jsx'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement.jsx'));
const AdminRestaurants = lazy(() => import('../pages/admin/AdminRestaurants.jsx'));
const AdminFoods = lazy(() => import('../pages/admin/AdminFoods.jsx'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders.jsx'));

const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      Loading...
    </span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. Public & Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Customer Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['customer']}>
                  <CartPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 2. Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 3. Restaurant Owner Protected Routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['restaurantOwner', 'owner', 'admin']}>
                <OwnerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="restaurants" element={<RestaurantManagement />} />
          <Route path="foods" element={<FoodManagement />} />
          <Route path="orders" element={<OwnerOrders />} />
        </Route>

        {/* 4. Super Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="foods" element={<AdminFoods />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* 5. 404 Fallback */}
        <Route element={<CustomerLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
