import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const orderService = {
  // Customer: Place a new order
  async placeOrder(orderData) {
    const res = await api.post(ENDPOINTS.ORDERS.BASE, orderData);
    return res.data;
  },

  // Customer: Get order history
  async getMyOrders() {
    const res = await api.get(ENDPOINTS.ORDERS.MY_ORDERS);
    return res.data;
  },

  // Customer / Owner / Admin: Get order details by ID
  async getOrderById(orderId) {
    const res = await api.get(ENDPOINTS.ORDERS.BY_ID(orderId));
    return res.data;
  },

  // Customer / Admin: Cancel pending order
  async cancelOrder(orderId) {
    const res = await api.put(ENDPOINTS.ORDERS.CANCEL(orderId));
    return res.data;
  },

  // Owner: Get incoming orders for owned restaurants
  async getRestaurantOrders() {
    const res = await api.get(ENDPOINTS.ORDERS.RESTAURANT_ORDERS);
    return res.data;
  },

  // Owner / Admin: Update order status
  async updateOrderStatus(orderId, statusData) {
    const res = await api.put(ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), statusData);
    return res.data;
  },

  // Admin: Get all orders across platform
  async getAllOrders() {
    const res = await api.get(ENDPOINTS.ORDERS.ADMIN_ALL);
    return res.data;
  },
};
