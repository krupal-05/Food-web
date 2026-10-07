import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Star, Clock, MapPin, Phone, ArrowLeft, Plus, Minus, Search, MessageSquare, Send, Check, ShieldCheck, ChevronDown, ChevronUp, Sparkles, X, Info } from "lucide-react";
import api from "../services/api.js";

export default function RestaurantView() {
  const {
    selectedRestaurant,
    foodItems,
    addToCart,
    cart,
    updateCartItemQty,
    setCurrentTab,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("menu"); // menu | reviews
  const [menuSearch, setMenuSearch] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedFoodForCustomization, setSelectedFoodForCustomization] = useState(null);
  const [selectedModifier, setSelectedModifier] = useState(null);

  const [reviewsList, setReviewsList] = useState([
    {
      _id: "rev-1",
      user: { firstName: "Ananya", lastName: "Sen" },
      rating: 5,
      comment: "Super fast delivery! The handi seal was hot and the saffron mutton biryani aroma was unbelievable.",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "rev-2",
      user: { firstName: "Rahul", lastName: "Verma" },
      rating: 4,
      comment: "Rich flavours, premium packaging with eco-friendly earthen handis. Highly recommended.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const restId = selectedRestaurant?.id || selectedRestaurant?._id;

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (restId) {
          const res = await api.getReviews(restId);
          if (res?.data?.reviews?.length) {
            setReviewsList(res.data.reviews);
          }
        }
      } catch {
        // use local
      }
    };
    fetchReviews();
  }, [restId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.addReview(restId, newRating, newComment);
    } catch (err) {
      console.warn("Backend review notice:", err.message);
    }

    const created = {
      _id: `rev-${Date.now()}`,
      user: { firstName: "You" },
      rating: Number(newRating),
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviewsList([created, ...reviewsList]);
    setNewComment("");
    setSubmittingReview(false);
    showToast("Thank you for your rating & review!");
  };

  const dishes = foodItems.filter((f) => (f.restaurantId || f.restaurant) === restId);

  const filteredDishes = dishes.filter((f) => {
    if (vegOnly && f.foodType !== "veg") return false;
    if (menuSearch) {
      const q = menuSearch.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.category?.toLowerCase()?.includes(q);
    }
    return true;
  });

  const getCartQty = (foodId) => {
    const item = cart.items.find((i) => (i.food._id || i.food.id) === foodId);
    return item ? item.quantity : 0;
  };

  const getCartIndex = (foodId) => {
    return cart.items.findIndex((i) => (i.food._id || i.food.id) === foodId);
  };

  const handleOpenCustomization = (food) => {
    if (food.modifiers && food.modifiers.length > 0) {
      setSelectedFoodForCustomization(food);
      const defaultMod = food.modifiers.find((m) => m.default) || food.modifiers[0];
      setSelectedModifier(defaultMod);
    } else {
      addToCart(food, 1);
    }
  };

  const handleConfirmCustomization = () => {
    if (!selectedFoodForCustomization) return;
    const finalPrice = selectedFoodForCustomization.price + (selectedModifier?.price || 0);
    const customizedFood = {
      ...selectedFoodForCustomization,
      price: finalPrice,
      name: selectedModifier ? `${selectedFoodForCustomization.name} (${selectedModifier.name})` : selectedFoodForCustomization.name,
    };
    addToCart(customizedFood, 1);
    setSelectedFoodForCustomization(null);
  };

  // Group dishes by category
  const categories = ["Bestsellers", ...new Set(filteredDishes.map((d) => d.category || "Main Menu"))];

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => setCurrentTab("explore")}
        className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 w-fit cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to All Restaurants</span>
      </button>

      {/* Swiggy / Zomato Signature Restaurant Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedRestaurant?.name}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> FSSAI VERIFIED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {selectedRestaurant?.cuisine}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin size={12} />
              <span>{selectedRestaurant?.address?.street || "Sector 62"}, {selectedRestaurant?.address?.city || "Noida"}</span>
            </p>
          </div>

          {/* Rating Pill */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[90px]">
            <div className="flex items-center gap-1 text-base font-black text-emerald-700">
              <Star size={16} fill="currentColor" className="text-emerald-600" />
              <span>{selectedRestaurant?.rating || 4.8}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">
              {selectedRestaurant?.totalReviews || "1.2k+"} ratings
            </div>
          </div>
        </div>

        {/* Delivery & Offers strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-orange-500" />
              <span>{selectedRestaurant?.deliveryTime || 25} MINS</span>
            </span>
            <span>•</span>
            <span>{selectedRestaurant?.priceForTwo || "₹450 for two"}</span>
          </div>

          {selectedRestaurant?.offer && (
            <div className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-xl text-xs font-black">
              🏷️ {selectedRestaurant?.offer}
            </div>
          )}
        </div>
      </div>

      {/* Menu / Review Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`py-3 px-6 text-sm font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "menu"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Menu ({dishes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`py-3 px-6 text-sm font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "reviews"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Reviews & Ratings ({reviewsList.length})
        </button>
      </div>

      {/* TAB 1: Menu with Category Groups & Veg-Only Filter */}
      {activeTab === "menu" && (
        <div className="flex flex-col gap-6">
          {/* Menu Search & Veg Toggle Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder={`Search in ${selectedRestaurant?.name || "menu"}...`}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Veg Only Toggle Switch (Swiggy Signature) */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-bold text-slate-700">Veg Only</span>
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  vegOnly ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Dishes List */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDishes.map((food) => {
                const foodId = food._id || food.id;
                const qty = getCartQty(foodId);
                const cartIdx = getCartIndex(foodId);

                return (
                  <div
                    key={foodId}
                    className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center shrink-0 ${
                            food.foodType === "veg" ? "border-emerald-600" : "border-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              food.foodType === "veg" ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                        </span>
                        {food.isBestseller && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                            BESTSELLER
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {food.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 mt-1">
                        <span>₹{food.price}</span>
                        {food.originalPrice && (
                          <span className="text-xs text-slate-400 font-normal line-through">
                            ₹{food.originalPrice}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {food.description}
                      </p>
                    </div>

                    {/* Dish Image + Stepper Button */}
                    <div className="relative flex flex-col items-center shrink-0">
                      <img
                        src={food.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"}
                        alt={food.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover"
                      />

                      <div className="absolute -bottom-3 w-20">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleOpenCustomization(food)}
                            className="w-full py-1.5 bg-white hover:bg-orange-50 text-emerald-600 border border-slate-200 rounded-xl text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>ADD</span>
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        ) : (
                          <div className="w-full py-1 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-between px-2">
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(cartIdx, -1)}
                              className="hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span>{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(cartIdx, 1)}
                              className="hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                        )}
                      </div>

                      {food.customizable && (
                        <span className="text-[9px] text-slate-400 font-bold mt-4 block">
                          Customisable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Customer Reviews & Rating Submission */}
      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rate Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 h-fit">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-orange-500" />
              <span>Leave a Food Review</span>
            </h3>

            <form onSubmit={handleAddReview} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        newRating >= star ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Star size={16} fill={newRating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How was the taste, packaging, and food temperature?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Rating</span>
              </button>
            </form>
          </div>

          {/* Testimonials Stream */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-900">Verified Customer Reviews</h3>
            <div className="flex flex-col gap-3">
              {reviewsList.map((rev) => (
                <div
                  key={rev._id || rev.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                        {rev.user?.firstName?.[0] || "U"}
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {rev.user?.firstName} {rev.user?.lastName || ""}
                      </span>
                    </div>

                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1 bg-amber-50 px-2.5 py-1 rounded-xl">
                      <Star size={12} fill="currentColor" />
                      <span>{rev.rating} / 5</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swiggy-Style Customisation Modal */}
      {selectedFoodForCustomization && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Customise {selectedFoodForCustomization.name}
                </h3>
                <p className="text-xs text-slate-500">Choose portion size & add-ons</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFoodForCustomization(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-2">
              {selectedFoodForCustomization.modifiers?.map((mod, idx) => {
                const isSelected = selectedModifier?.name === mod.name;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedModifier(mod)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/50 shadow-xs"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{mod.name}</div>
                    <div className="text-xs font-black text-slate-700">
                      {mod.price === 0 ? "Included" : `+₹${mod.price}`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total & Confirm */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Item Price</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{selectedFoodForCustomization.price + (selectedModifier?.price || 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmCustomization}
                className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Add Item to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
