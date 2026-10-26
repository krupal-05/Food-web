import api from './api.js';
import { ENDPOINTS } from '../constants/api.constants.js';

export const authService = {
  // Register new user (customer, restaurantOwner, etc.)
  async register(userData) {
    const res = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return res.data;
  },

  // Login user
  async login(credentials) {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return res.data;
  },

  // Logout user
  async logout() {
    const res = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  },

  // Get current user profile
  async getCurrentUser() {
    const res = await api.get(ENDPOINTS.AUTH.ME);
    return res.data;
  },

  // Update profile
  async updateProfile(profileData) {
    const res = await api.put(ENDPOINTS.AUTH.PROFILE, profileData);
    return res.data;
  },

  // Change password
  async changePassword(data) {
    const res = await api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return res.data;
  },

  // Admin: Get all users
  async getAllUsers() {
    const res = await api.get(ENDPOINTS.AUTH.ALL_USERS);
    return res.data;
  },
};
