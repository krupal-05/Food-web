const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("foodx_access_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("foodx_access_token", token);
    } else {
      localStorage.removeItem("foodx_access_token");
    }
  }

  getToken() {
    return this.token || localStorage.getItem("foodx_access_token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { ...options.headers };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const currentToken = this.getToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }
      return data;
    } catch (error) {
      console.warn(`[API] ${options.method || "GET"} ${endpoint} error:`, error.message);
      throw error;
    }
  }

  // --- Auth APIs ---
  async register(userData) {
    const res = await this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (res?.data?.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res;
  }

  async login(email, password) {
    const res = await this.request("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res?.data?.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res;
  }

  async logout() {
    try {
      await this.request("/users/logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(oldPassword, newPassword) {
    return this.request("/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // --- Restaurant APIs ---
  async getRestaurants(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/restaurants${query ? `?${query}` : ""}`);
  }

  async getRestaurantById(id) {
    return this.request(`/restaurants/${id}`);
  }

  async registerRestaurant(formData) {
    return this.request("/restaurants/register", {
      method: "POST",
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
    });
  }

  async getMyRestaurants() {
    return this.request("/restaurants/owner/my-restaurants");
  }

  async updateRestaurant(id, data) {
    return this.request(`/restaurants/${id}`, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // --- Foods APIs ---
  async getFoods(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/foods${query ? `?${query}` : ""}`);
  }

  async getFoodById(id) {
    return this.request(`/foods/${id}`);
  }

  async getFoodsByRestaurant(restaurantId) {
    return this.request(`/foods/restaurant/${restaurantId}`);
  }

  async addFood(foodData) {
    return this.request("/foods", {
      method: "POST",
      body: foodData instanceof FormData ? foodData : JSON.stringify(foodData),
    });
  }

  async updateFood(id, foodData) {
    return this.request(`/foods/${id}`, {
      method: "PUT",
      body: foodData instanceof FormData ? foodData : JSON.stringify(foodData),
    });
  }

  async deleteFood(id) {
    return this.request(`/foods/${id}`, { method: "DELETE" });
  }

  // --- Cart APIs ---
  async getCart() {
    return this.request("/cart");
  }

  async addToCart(foodId, quantity = 1) {
    return this.request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ foodId, quantity }),
    });
  }

  async updateCartItem(foodId, quantity) {
    return this.request("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({ foodId, quantity }),
    });
  }

  async removeCartItem(foodId) {
    return this.request(`/cart/items/${foodId}`, { method: "DELETE" });
  }

  async clearCart() {
    return this.request("/cart/clear", { method: "DELETE" });
  }

  // --- Orders APIs ---
  async createOrder(orderPayload) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });
  }

  async getMyOrders() {
    return this.request("/orders/my-orders");
  }

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, { method: "PUT" });
  }

  async getRestaurantOrders() {
    return this.request("/orders/owner/restaurant-orders");
  }

  async updateOrderStatus(orderId, status, paymentStatus) {
    return this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, paymentStatus }),
    });
  }

  async getAllOrders() {
    return this.request("/orders/admin/all");
  }

  // --- Reviews APIs ---
  async getReviews(restaurantId) {
    return this.request(`/reviews/restaurant/${restaurantId}`);
  }

  async addReview(restaurantId, rating, comment) {
    return this.request("/reviews", {
      method: "POST",
      body: JSON.stringify({ restaurantId, rating, comment }),
    });
  }
}

export const api = new ApiService();
export default api;
