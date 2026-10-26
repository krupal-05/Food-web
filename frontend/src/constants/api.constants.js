export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const ENDPOINTS = {
  // Auth & User
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    ME: '/users/user',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    ALL_USERS: '/users/users',
  },
  // Restaurants
  RESTAURANTS: {
    BASE: '/restaurants',
    ALL: '/restaurants',
    BY_ID: (id) => `/restaurants/${id}`,
    REGISTER: '/restaurants/register',
    MY_RESTAURANTS: '/restaurants/owner/my-restaurants',
  },
  // Foods
  FOODS: {
    BASE: '/foods',
    ALL: '/foods',
    BY_ID: (id) => `/foods/${id}`,
    BY_RESTAURANT: (restaurantId) => `/foods/restaurant/${restaurantId}`,
    UPDATE_IMAGE: (id) => `/foods/${id}/image`,
  },
  // Cart
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    ITEM_BY_ID: (foodId) => `/cart/items/${foodId}`,
    CLEAR: '/cart/clear',
  },
  // Orders
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    BY_ID: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    RESTAURANT_ORDERS: '/orders/owner/restaurant-orders',
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    ADMIN_ALL: '/orders/admin/all',
  },
  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    BY_RESTAURANT: (restaurantId) => `/reviews/restaurant/${restaurantId}`,
    BY_ID: (id) => `/reviews/${id}`,
  },
};
