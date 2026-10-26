import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/api.constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('food_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & Unified Error Extraction
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // If response follows ApiResponse shape: { statusCode, data, message, success }
    return response.data?.data !== undefined ? response.data : response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 and Token Refreshing
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(ENDPOINTS.AUTH.LOGIN) &&
      !originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('food_refresh_token');

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;
        const newRefreshToken =
          refreshResponse.data?.data?.reFreshToken ||
          refreshResponse.data?.reFreshToken;

        if (newAccessToken) {
          localStorage.setItem('food_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('food_refresh_token', newRefreshToken);
          }

          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('food_access_token');
        localStorage.removeItem('food_refresh_token');
        localStorage.removeItem('food_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract standardized message
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unexpected network error occurred';

    error.extractedMessage = customMessage;
    return Promise.reject(error);
  }
);

export default api;
