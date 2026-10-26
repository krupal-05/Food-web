import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const cartService = {
  // Get current user's cart
  async getCart() {
    const res = await api.get(ENDPOINTS.CART.BASE);
    return res.data;
  },

  // Add item to cart
  async addToCart(foodId, quantity = 1) {
    const res = await api.post(ENDPOINTS.CART.ITEMS, { foodId, quantity });
    return res.data;
  },

  // Update item quantity
  async updateQuantity(foodId, quantity) {
    const res = await api.patch(ENDPOINTS.CART.ITEMS, { foodId, quantity });
    return res.data;
  },

  // Remove single item
  async removeItem(foodId) {
    const res = await api.delete(ENDPOINTS.CART.ITEM_BY_ID(foodId));
    return res.data;
  },

  // Clear entire cart
  async clearCart() {
    const res = await api.delete(ENDPOINTS.CART.CLEAR);
    return res.data;
  },
};
