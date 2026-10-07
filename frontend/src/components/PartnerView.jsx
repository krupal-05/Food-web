import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Store, ChefHat, Plus, X, Check, Flame, Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import api from "../services/api.js";

export default function PartnerView() {
  const {
    foodItems,
    addNewFood,
    toggleFoodStock,
    orders,
    updateOrderStatus,
    showToast,
    currentUser,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState("kds"); // kds | menu | settings
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [partnerOrders, setPartnerOrders] = useState([]);

  const [newDishForm, setNewDishForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Handi Biryanis",
    foodType: "veg",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
  });

  // Fetch restaurant orders from backend
  useEffect(() => {
    const fetchPartnerOrders = async () => {
      try {
        const res = await api.getRestaurantOrders();
        if (res?.data?.orders) {
          setPartnerOrders(res.data.orders);
        }
      } catch {
        // Fallback to local orders
        setPartnerOrders(orders);
      }
    };
    fetchPartnerOrders();
  }, [orders]);

  const handleAddDishSubmit = async (e) => {
    e.preventDefault();
    if (!newDishForm.name.trim() || !newDishForm.price) {
      showToast("Dish name and price are required", "error");
      return;
    }

    await addNewFood({
      ...newDishForm,
      price: Number(newDishForm.price),
      restaurant: currentUser.restaurantId || "rest-1",
    });

    setShowAddDishModal(false);
    setNewDishForm({
      name: "",
      description: "",
      price: "",
      category: "Handi Biryanis",
      foodType: "veg",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    });
  };

  const pendingKDSOrders = partnerOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "ready"].includes(o.status)
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
      {/* Partner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Merchant Partner Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            {currentUser.restaurantName || "Biryani by Kilo"} • Kitchen Portal
          </h1>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab("kds")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "kds"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live KDS Queue ({pendingKDSOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("menu")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === "menu"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dish & Stock Control
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Today's Revenue</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">₹18,450</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">↑ +14.2% vs yesterday</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Orders Prepared</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">42 Tickets</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Avg Prep Time: 18m</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Kitchen Rating</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">4.8 ★</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Top Rated Merchant</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Active Menu Items</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{foodItems.length} Dishes</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">In Stock & Serving</div>
        </div>
      </div>

      {/* SUBTAB 1: Kitchen Display System (KDS) */}
      {activeSubTab === "kds" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900">Live Incoming Orders Queue</h3>
          {pendingKDSOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
              <ChefHat size={36} className="mx-auto mb-2 text-slate-400" />
              <div className="text-sm font-bold text-slate-800">No active kitchen orders</div>
              <p className="text-xs mt-0.5">All tickets have been cooked & dispatched!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingKDSOrders.map((ord) => {
                const ordId = ord._id || ord.id;
                const isPending = ord.status === "pending";
                const isCooking = ord.status === "confirmed" || ord.status === "preparing";
                const isReady = ord.status === "ready";

                return (
                  <div
                    key={ordId}
                    className="bg-white border-2 border-orange-500 rounded-3xl p-5 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Ticket ID</span>
                          <h4 className="text-base font-black text-slate-900">{ordId}</h4>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          {ord.status}
                        </span>
                      </div>

                      <div className="py-3 flex flex-col gap-1.5">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-bold text-slate-900">{item.quantity}x {item.name}</span>
                            <span className="text-slate-500 font-semibold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ordId, "preparing")}
                          className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                        >
                          <ChefHat size={14} />
                          <span>Accept & Start Cooking</span>
                        </button>
                      )}

                      {isCooking && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ordId, "ready")}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                        >
                          <Check size={14} strokeWidth={3} />
                          <span>Mark Food Ready for Rider</span>
                        </button>
                      )}

                      {isReady && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ordId, "out_for_delivery")}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                        >
                          <span>Handover to Rider (OTP: 4829)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: Menu Stock Control */}
      {activeSubTab === "menu" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Manage Menu & Availability</h3>
            <button
              type="button"
              onClick={() => setShowAddDishModal(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((food) => {
              const foodId = food._id || food.id;
              return (
                <div
                  key={foodId}
                  className={`bg-white rounded-3xl p-4 border shadow-sm flex flex-col justify-between gap-3 ${
                    food.isAvailable ? "border-slate-200" : "border-red-200 bg-red-50/20"
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={food.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"}
                      alt={food.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{food.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{food.category}</p>
                      <div className="text-sm font-black text-slate-900 mt-1">₹{food.price}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-xs font-bold ${food.isAvailable ? "text-emerald-600" : "text-red-600"}`}>
                      {food.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFoodStock(foodId)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        food.isAvailable
                          ? "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {food.isAvailable ? "Mark Sold Out" : "Enable Serving"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add New Dish to Kitchen</h3>
              <button
                type="button"
                onClick={() => setShowAddDishModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newDishForm.name}
                  onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                  placeholder="e.g. Saffron Chicken Tikka Biryani"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDishForm.price}
                    onChange={(e) => setNewDishForm({ ...newDishForm, price: e.target.value })}
                    placeholder="349"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDishForm.category}
                    onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="Handi Biryanis">Handi Biryanis</option>
                    <option value="Kebabs & Starters">Kebabs & Starters</option>
                    <option value="Smash Burgers">Smash Burgers</option>
                    <option value="Signature Pizzas">Signature Pizzas</option>
                    <option value="Main Curries">Main Curries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDishForm({ ...newDishForm, foodType: "veg" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newDishForm.foodType === "veg"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    🌱 Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDishForm({ ...newDishForm, foodType: "non-veg" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      newDishForm.foodType === "non-veg"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    🍗 Non-Veg
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all mt-2 cursor-pointer"
              >
                Publish Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
