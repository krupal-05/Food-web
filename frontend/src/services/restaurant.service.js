import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const restaurantService = {
  // Public: Get all restaurants with optional query params
  async getAllRestaurants(params = {}) {
    const res = await api.get(ENDPOINTS.RESTAURANTS.ALL, { params });
    return res.data;
  },

  // Public: Get restaurant by ID (includes its food menu)
  async getRestaurantById(id) {
    const res = await api.get(ENDPOINTS.RESTAURANTS.BY_ID(id));
    return res.data;
  },

  // Owner: Register a new restaurant
  async registerRestaurant(formData) {
    const isFormData = formData instanceof FormData;
    const res = await api.post(ENDPOINTS.RESTAURANTS.REGISTER, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Owner: Get own restaurants
  async getMyRestaurants() {
    const res = await api.get(ENDPOINTS.RESTAURANTS.MY_RESTAURANTS);
    return res.data;
  },

  // Owner / Admin: Update restaurant
  async updateRestaurant(id, formData) {
    const isFormData = formData instanceof FormData;
    const res = await api.put(ENDPOINTS.RESTAURANTS.BY_ID(id), formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Owner / Admin: Delete restaurant
  async deleteRestaurant(id) {
    const res = await api.delete(ENDPOINTS.RESTAURANTS.BY_ID(id));
    return res.data;
  },
};
