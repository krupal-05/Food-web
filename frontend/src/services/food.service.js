import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const foodService = {
  // Public: Get all foods with search/filter/pagination params
  async getAllFoods(params = {}) {
    const res = await api.get(ENDPOINTS.FOODS.ALL, { params });
    return res.data;
  },

  // Public: Get food by ID
  async getFoodById(id) {
    const res = await api.get(ENDPOINTS.FOODS.BY_ID(id));
    return res.data;
  },

  // Public: Get all foods by restaurant ID
  async getFoodsByRestaurant(restaurantId) {
    const res = await api.get(ENDPOINTS.FOODS.BY_RESTAURANT(restaurantId));
    return res.data;
  },

  // Owner / Admin: Add food item
  async addFoodItem(formData) {
    const isFormData = formData instanceof FormData;
    const res = await api.post(ENDPOINTS.FOODS.BASE, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Owner / Admin: Update food item
  async updateFood(id, formData) {
    const isFormData = formData instanceof FormData;
    const res = await api.put(ENDPOINTS.FOODS.BY_ID(id), formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },

  // Owner / Admin: Update food image
  async updateFoodImage(id, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await api.patch(ENDPOINTS.FOODS.UPDATE_IMAGE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Owner / Admin: Delete food item
  async deleteFood(id) {
    const res = await api.delete(ENDPOINTS.FOODS.BY_ID(id));
    return res.data;
  },
};
