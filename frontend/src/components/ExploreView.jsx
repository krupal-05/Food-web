import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Star, Clock, MapPin, Plus, Minus, Sparkles, Flame, Check, Percent, ArrowRight, SlidersHorizontal, ChevronRight, Zap } from "lucide-react";

const cuisineCategories = [
  { name: "All", label: "All Items", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" },
  { name: "Biryani", label: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300" },
  { name: "Burgers", label: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300" },
  { name: "Pizzas", label: "Pizzas", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300" },
  { name: "North Indian", label: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300" },
  { name: "Kebabs", label: "Kebabs", image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300" },
  { name: "Fries", label: "Crispy Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300" },
];

export default function ExploreView() {
  const {
    restaurants,
    foodItems,
    setSelectedRestaurant,
    setCurrentTab,
    selectedCategory,
    setSelectedCategory,
    dietaryFilter,
    setDietaryFilter,
    searchQuery,
    addToCart,
    cart,
    updateCartItemQty,
  } = useApp();

  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [filterOffers, setFilterOffers] = useState(false);
  const [sortBy, setSortBy] = useState("rating"); // rating | delivery | price

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedCategory !== "All" && !r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (filterFastDelivery && (r.deliveryTime || 30) > 25) return false;
    if (filterTopRated && (r.rating || 0) < 4.6) return false;
    if (filterOffers && !r.offer) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisine.toLowerCase().includes(q);
      const matchLoc = r.locality?.toLowerCase()?.includes(q) || r.address?.city?.toLowerCase()?.includes(q);
      if (!matchName && !matchCuisine && !matchLoc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "delivery") return (a.deliveryTime || 30) - (b.deliveryTime || 30);
    return (b.rating || 4.5) - (a.rating || 4.5);
  });

  // Filter dishes
  const filteredFoods = foodItems.filter((f) => {
    if (dietaryFilter === "veg" && f.foodType !== "veg") return false;
    if (dietaryFilter === "non-veg" && f.foodType === "veg") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchCat = f.category?.toLowerCase()?.includes(q);
      const matchDesc = f.description?.toLowerCase()?.includes(q);
      if (!matchName && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  // Helper to find quantity in cart
  const getCartQty = (foodId) => {
    const item = cart.items.find((i) => (i.food._id || i.food.id) === foodId);
    return item ? item.quantity : 0;
  };

  const getCartIndex = (foodId) => {
    return cart.items.findIndex((i) => (i.food._id || i.food.id) === foodId);
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* 1. Swiggy-Style Hero Promotional Offers Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1: Flat 50% OFF */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[190px]">
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[11px] font-black px-3 py-1 rounded-full mb-2 border border-orange-500/30">
              <Percent size={12} /> SPECIAL CRAVING DEAL
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Flat 50% OFF + Free Delivery
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Apply coupon <strong className="text-amber-400 font-mono">FOODX50</strong> at checkout on all orders
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button
              onClick={() => {
                setSelectedRestaurant(restaurants[0]);
                setCurrentTab("restaurant");
              }}
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span>Order Biryani</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="absolute right-2 -bottom-4 text-7xl sm:text-8xl opacity-15 pointer-events-none select-none">
            🥘
          </div>
        </div>

        {/* Banner 2: Gourmet Woodfired */}
        <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[190px]">
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-black px-3 py-1 rounded-full mb-2 backdrop-blur-md">
              <Zap size={12} /> SUPERFAST DELIVERY
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Artisanal Pizzas & Gourmet Burgers
            </h2>
            <p className="text-xs text-amber-100 mt-1">
              Prepared hot by top chefs with under 25-minute doorstep guarantee
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <button
              onClick={() => {
                setSelectedRestaurant(restaurants[1]);
                setCurrentTab("restaurant");
              }}
              className="py-2 px-4 bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span>Explore Burgers</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="absolute right-2 -bottom-4 text-7xl sm:text-8xl opacity-20 pointer-events-none select-none">
            🍕
          </div>
        </div>
      </div>

      {/* 2. Swiggy-Style "What's on your mind?" Circular Cuisine Stories */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            What's on your mind?
          </h2>
          <span className="text-xs font-bold text-orange-600 hover:underline cursor-pointer">
            Explore All Cuisines
          </span>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {cuisineCategories.map((c) => {
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedCategory(c.name)}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                    isSelected
                      ? "border-orange-500 ring-4 ring-orange-500/20 scale-105"
                      : "border-slate-200 group-hover:border-orange-300"
                  }`}
                >
                  <img
                    src={c.image}
                    alt={c.label}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${
                    isSelected ? "text-orange-600 font-black" : "text-slate-700 group-hover:text-slate-900"
                  }`}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Swiggy-Style Filter & Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200/80 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Fast Delivery Filter */}
          <button
            type="button"
            onClick={() => setFilterFastDelivery(!filterFastDelivery)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filterFastDelivery
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <Clock size={13} />
            <span>Fast Delivery (&lt; 25m)</span>
          </button>

          {/* Top Rated 4.5+ */}
          <button
            type="button"
            onClick={() => setFilterTopRated(!filterTopRated)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filterTopRated
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <Star size={13} fill={filterTopRated ? "white" : "none"} />
            <span>Rating 4.6+</span>
          </button>

          {/* Offers */}
          <button
            type="button"
            onClick={() => setFilterOffers(!filterOffers)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filterOffers
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <Percent size={13} />
            <span>Offers & Deals</span>
          </button>

          {/* Pure Veg Switcher */}
          <button
            type="button"
            onClick={() => setDietaryFilter(dietaryFilter === "veg" ? "all" : "veg")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              dietaryFilter === "veg"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pure Veg</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
        </div>
      </div>

      {/* 4. Swiggy-Style Signature Restaurant Cards Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Top Restaurant Chains in Noida & NCR
            </h2>
            <p className="text-xs text-slate-500">
              {filteredRestaurants.length} verified culinary partners near you
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((rest) => (
            <div
              key={rest.id || rest._id}
              onClick={() => {
                setSelectedRestaurant(rest);
                setCurrentTab("restaurant");
              }}
              className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between border border-slate-200/80 hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Swiggy Overlay Offer Pill */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={rest.image || rest.imageUrl}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15" />

                  {/* Swiggy-Style Discount Ribbon */}
                  {rest.offer && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                      <Percent size={12} />
                      <span>{rest.offer}</span>
                    </div>
                  )}

                  {/* FoodX One / Gold Badge */}
                  {rest.isFoodXOne && (
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/30 text-[10px] font-black px-2 py-0.5 rounded-lg">
                      FOODX ONE
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                    {rest.name}
                  </h3>

                  {/* Rating & ETA Bar */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-0.5">
                    <span className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[11px] font-black">
                      <Star size={11} fill="white" />
                      <span>{rest.rating || 4.5}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-800 font-extrabold">{rest.deliveryTime || 25} mins</span>
                    <span>•</span>
                    <span className="text-slate-500">{rest.priceForTwo || "₹400 for two"}</span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-1">{rest.cuisine}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    <span>{rest.locality || rest.address?.city || "Noida"}</span>
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-emerald-600">✓ Free Delivery</span>
                <span className="font-extrabold text-orange-600 group-hover:underline flex items-center gap-0.5">
                  Order Now →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trending Dishes with Zomato/Swiggy Stepper ADD Buttons */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trending Dishes Near You
          </h2>
          <p className="text-xs text-slate-500">
            Most loved dishes in your area with fast preparation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFoods.map((food) => {
            const foodId = food._id || food.id;
            const qty = getCartQty(foodId);
            const cartIdx = getCartIndex(foodId);

            return (
              <div
                key={foodId}
                className="bg-white border border-slate-200/90 hover:border-orange-300 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-4"
              >
                {/* Left Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* FSSAI Dietary Badge */}
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
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <Flame size={10} className="text-amber-600" /> BESTSELLER
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {food.name}
                  </h4>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 mt-1">
                    <span>₹{food.price}</span>
                    {food.originalPrice && (
                      <span className="text-xs text-slate-400 font-normal line-through">
                        ₹{food.originalPrice}
                      </span>
                    )}
                  </div>

                  {food.rating && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 font-black mt-1">
                      <Star size={11} fill="currentColor" className="text-amber-500" />
                      <span>{food.rating}</span>
                      <span className="text-slate-400 font-normal">({food.ratingCount || 120})</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {food.description}
                  </p>
                </div>

                {/* Right Image with Swiggy Floating ADD / Stepper Button */}
                <div className="relative flex flex-col items-center shrink-0">
                  <img
                    src={food.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"}
                    alt={food.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-xs"
                  />

                  {/* Floating Action Button */}
                  <div className="absolute -bottom-3 w-20">
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => addToCart(food, 1)}
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
      </section>
    </div>
  );
}
