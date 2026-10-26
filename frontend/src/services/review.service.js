import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const reviewService = {
  // Public: Get reviews for a restaurant
  async getRestaurantReviews(restaurantId) {
    const res = await api.get(ENDPOINTS.REVIEWS.BY_RESTAURANT(restaurantId));
    return res.data;
  },

  // Customer: Add review for restaurant
  async addReview(reviewData) {
    const res = await api.post(ENDPOINTS.REVIEWS.BASE, reviewData);
    return res.data;
  },

  // Author / Admin: Delete review
  async deleteReview(reviewId) {
    const res = await api.delete(ENDPOINTS.REVIEWS.BY_ID(reviewId));
    return res.data;
  },
};
