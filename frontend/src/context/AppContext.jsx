import React, { createContext, useContext, useState, useEffect } from "react";
import { initialRestaurants, initialFoodItems } from "../mockData.js";
import api from "../services/api.js";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState("explore"); // explore | restaurant | cart | checkout | orders | partner | admin | profile
  const [selectedRestaurant, setSelectedRestaurant] = useState(initialRestaurants[0]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("all"); // all | veg | non-veg

  // Auth & Role-Based Access Control (RBAC)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("foodx_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: "user-1",
          firstName: "Priya",
          lastName: "Sharma",
          email: "priya.sharma@example.com",
          phone: "+91 98765 43210",
          role: "customer", // customer | restaurantOwner | admin
          address: {
            street: "Flat 402, Green Valley Apts, Sector 62",
            city: "Noida",
            pincode: "201309",
          },
          walletBalance: 500,
        };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Data Collections
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [orders, setOrders] = useState([]);

  // Cart State (Customer specific)
  const [cart, setCart] = useState({
    restaurantId: "rest-1",
    restaurantName: "Biryani by Kilo",
    items: [
      {
        food: initialFoodItems[0],
        quantity: 1,
        price: initialFoodItems[0].price,
        itemTotal: initialFoodItems[0].price,
      },
    ],
    cookingNotes: "",
    promoCode: "FOODX50",
    promoDiscount: 50,
  });

  // Toast Banner
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync Initial Data with Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const restRes = await api.getRestaurants();
        if (restRes?.data?.restaurants?.length) {
          const apiRests = restRes.data.restaurants.map((r) => ({
            ...r,
            id: r._id || r.id,
            image: r.imageUrl || r.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
          }));
          setRestaurants(apiRests);
          setSelectedRestaurant(apiRests[0]);
        }
      } catch {
        // Fallback to initial
      }

      try {
        const foodRes = await api.getFoods();
        if (foodRes?.data?.foods?.length) {
          const apiFoods = foodRes.data.foods.map((f) => ({
            ...f,
            id: f._id || f.id,
            restaurantId: f.restaurant?._id || f.restaurant || f.restaurantId,
          }));
          setFoodItems(apiFoods);
        }
      } catch {
        // Fallback to initial
      }

      if (api.getToken()) {
        try {
          const profileRes = await api.getProfile();
          if (profileRes?.data?.user) {
            setCurrentUser(profileRes.data.user);
            setIsAuthenticated(true);
          }
        } catch {
          // Token expired
        }

        try {
          const myOrdersRes = await api.getMyOrders();
          if (myOrdersRes?.data?.orders) {
            setOrders(myOrdersRes.data.orders);
          }
        } catch {
          // Keep local
        }
      }
    };

    fetchBackendData();
  }, []);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("foodx_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("foodx_user");
    }
  }, [currentUser]);

  // Role Permissions Helper
  const hasRole = (role) => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true; // Super Admin has super-user access
    return currentUser.role?.toLowerCase() === role?.toLowerCase();
  };

  const isCustomer = () => hasRole("customer");
  const isMerchant = () => hasRole("restaurantOwner") || currentUser?.role === "owner";
  const isAdmin = () => currentUser?.role === "admin";

  // Switch App Persona (Demo fast switcher)
  const switchRole = (role) => {
    if (role === "customer") {
      const u = {
        id: "user-1",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 98765 43210",
        role: "customer",
        address: { street: "Flat 402, Green Valley, Sector 62", city: "Noida", pincode: "201309" },
        walletBalance: 500,
      };
      setCurrentUser(u);
      setIsAuthenticated(true);
      setCurrentTab("explore");
      showToast("Logged in as Customer (Priya Sharma)");
    } else if (role === "restaurantOwner") {
      const u = {
        id: "owner-1",
        firstName: "Rajesh",
        lastName: "Gupta",
        email: "rajesh@biryanikilo.com",
        phone: "+91 98111 22334",
        role: "restaurantOwner",
        restaurantId: "rest-1",
        restaurantName: "Biryani by Kilo",
        address: { street: "Shop 4, Express Food Plaza", city: "Noida", pincode: "201309" },
      };
      setCurrentUser(u);
      setIsAuthenticated(true);
      setCurrentTab("partner");
      showToast("Logged in as Restaurant Merchant (Rajesh Gupta)");
    } else if (role === "admin") {
      const u = {
        id: "admin-1",
        firstName: "Anita",
        lastName: "Deshmukh",
        email: "anita.ops@foodx.com",
        phone: "+91 99000 88776",
        role: "admin",
        address: { street: "FoodX HQ, Cyber Hub", city: "Gurugram", pincode: "122002" },
      };
      setCurrentUser(u);
      setIsAuthenticated(true);
      setCurrentTab("admin");
      showToast("Logged in as Super Admin (Anita Deshmukh)");
    }
  };

  // Cart Calculations
  const getItemTotal = () => cart.items.reduce((acc, item) => acc + item.itemTotal, 0);
  const packagingFee = cart.items.length > 0 ? 25 : 0;
  const deliveryFee = cart.items.length > 0 ? (getItemTotal() > 299 ? 0 : 35) : 0;
  const gstTax = Math.round(getItemTotal() * 0.05);
  const grandTotal = Math.max(0, getItemTotal() + packagingFee + deliveryFee + gstTax - cart.promoDiscount);

  // Cart Actions
  const addToCart = (food, qty = 1) => {
    const targetRest = restaurants.find((r) => r.id === (food.restaurantId || food.restaurant)) || selectedRestaurant;

    if (cart.restaurantId && cart.restaurantId !== (food.restaurantId || food.restaurant) && cart.items.length > 0) {
      const proceed = window.confirm(
        `Your cart contains items from "${cart.restaurantName}". Clear cart and add from "${targetRest.name}"?`
      );
      if (!proceed) return;
    }

    setCart((prev) => {
      const existingIdx = prev.items.findIndex((i) => (i.food.id || i.food._id) === (food.id || food._id));
      let updatedItems = [...prev.items];

      if (existingIdx > -1) {
        const newQty = updatedItems[existingIdx].quantity + qty;
        updatedItems[existingIdx] = {
          ...updatedItems[existingIdx],
          quantity: newQty,
          itemTotal: food.price * newQty,
        };
      } else {
        updatedItems.push({
          food,
          quantity: qty,
          price: food.price,
          itemTotal: food.price * qty,
        });
      }

      return {
        ...prev,
        restaurantId: targetRest.id || targetRest._id,
        restaurantName: targetRest.name,
        items: updatedItems,
      };
    });

    showToast(`Added ${food.name} to cart!`);
  };

  const updateCartItemQty = (idx, delta) => {
    setCart((prev) => {
      const updated = [...prev.items];
      const newQty = updated[idx].quantity + delta;

      if (newQty <= 0) {
        updated.splice(idx, 1);
      } else {
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          itemTotal: updated[idx].price * newQty,
        };
      }

      return {
        ...prev,
        items: updated,
        restaurantId: updated.length === 0 ? null : prev.restaurantId,
        restaurantName: updated.length === 0 ? "" : prev.restaurantName,
      };
    });
  };

  const clearCart = () => {
    setCart({
      restaurantId: null,
      restaurantName: "",
      items: [],
      cookingNotes: "",
      promoCode: "",
      promoDiscount: 0,
    });
    showToast("Cart cleared");
  };

  const applyPromo = (code) => {
    if (code.toUpperCase() === "FOODX50" || code.toUpperCase() === "WELCOME") {
      setCart((prev) => ({ ...prev, promoCode: code.toUpperCase(), promoDiscount: 50 }));
      showToast("Coupon applied! Saved ₹50");
    } else {
      showToast("Invalid promo code", "error");
    }
  };

  // Place Order (Customer action -> POST /api/v1/orders)
  const placeOrder = async (deliveryAddress, paymentMethod = "upi") => {
    if (cart.items.length === 0) {
      showToast("Cart is empty", "error");
      return null;
    }

    const orderAddress = deliveryAddress || currentUser?.address || {
      street: "Flat 402, Green Valley",
      city: "Noida",
      pincode: "201309",
    };

    const orderPayload = {
      restaurantId: cart.restaurantId,
      items: cart.items.map((i) => ({
        foodId: i.food._id || i.food.id,
        quantity: i.quantity,
        price: i.price,
        name: i.food.name,
      })),
      deliveryAddress: {
        street: orderAddress.street,
        city: orderAddress.city,
        pincode: String(orderAddress.pincode),
      },
      paymentMethod: paymentMethod.toLowerCase(),
      instructions: cart.cookingNotes || "",
    };

    let createdOrder = null;
    try {
      const res = await api.createOrder(orderPayload);
      if (res?.data?.order) {
        createdOrder = res.data.order;
      }
    } catch (err) {
      console.warn("Backend order creation notice:", err.message);
    }

    if (!createdOrder) {
      createdOrder = {
        _id: `FX-${Math.floor(10000 + Math.random() * 90000)}`,
        id: `FX-${Math.floor(10000 + Math.random() * 90000)}`,
        restaurant: {
          name: cart.restaurantName,
          id: cart.restaurantId,
        },
        items: cart.items.map((i) => ({
          name: i.food.name,
          quantity: i.quantity,
          price: i.price,
          foodType: i.food.foodType || "veg",
        })),
        totalAmount: grandTotal,
        status: "pending",
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        deliveryAddress: orderAddress,
        createdAt: new Date().toISOString(),
        etaMinutes: 25,
      };
    }

    setOrders([createdOrder, ...orders]);
    setSelectedOrder(createdOrder);
    clearCart();
    setCurrentTab("orders");
    showToast("Order placed & transmitted to kitchen!");
    return createdOrder;
  };

  // Cancel Order (Customer action -> PUT /api/v1/orders/:id/cancel)
  const cancelOrder = async (orderId) => {
    try {
      await api.cancelOrder(orderId);
    } catch (err) {
      console.warn("Backend order cancel notice:", err.message);
    }

    setOrders((prev) =>
      prev.map((o) => ((o._id === orderId || o.id === orderId) ? { ...o, status: "cancelled" } : o))
    );
    showToast(`Order cancelled`);
  };

  // Partner Order Status Lifecycle (Merchant action -> PUT /api/v1/orders/:id/status)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn("Backend order status notice:", err.message);
    }

    setOrders((prev) =>
      prev.map((o) => ((o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to ${newStatus.toUpperCase()}`);
  };

  // Add Dish (Merchant action -> POST /api/v1/foods)
  const addNewFood = async (foodData) => {
    let saved = null;
    try {
      const res = await api.addFood(foodData);
      if (res?.data?.food) {
        saved = res.data.food;
      }
    } catch (err) {
      console.warn("Backend add food notice:", err.message);
    }

    if (!saved) {
      saved = {
        _id: `food-${Date.now()}`,
        id: `food-${Date.now()}`,
        restaurantId: currentUser.restaurantId || "rest-1",
        ...foodData,
        isAvailable: true,
        rating: 5.0,
      };
    }

    setFoodItems([saved, ...foodItems]);
    showToast(`Added "${saved.name}" to menu!`);
  };

  // Toggle Dish Stock (Merchant action -> PUT /api/v1/foods/:id)
  const toggleFoodStock = async (foodId) => {
    const target = foodItems.find((f) => (f._id === foodId || f.id === foodId));
    if (!target) return;

    const newStock = !target.isAvailable;
    try {
      await api.updateFood(foodId, { isAvailable: newStock });
    } catch (err) {
      console.warn("Backend stock update notice:", err.message);
    }

    setFoodItems((prev) =>
      prev.map((f) => ((f._id === foodId || f.id === foodId) ? { ...f, isAvailable: newStock } : f))
    );
    showToast(`Updated "${target.name}" stock status`);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedRestaurant,
        setSelectedRestaurant,
        selectedOrder,
        setSelectedOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        dietaryFilter,
        setDietaryFilter,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        switchRole,
        hasRole,
        isCustomer,
        isMerchant,
        isAdmin,
        restaurants,
        setRestaurants,
        foodItems,
        setFoodItems,
        orders,
        setOrders,
        cart,
        setCart,
        addToCart,
        updateCartItemQty,
        clearCart,
        applyPromo,
        getItemTotal,
        packagingFee,
        deliveryFee,
        gstTax,
        grandTotal,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        addNewFood,
        toggleFoodStock,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
