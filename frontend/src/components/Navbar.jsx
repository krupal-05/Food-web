import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Search, ShoppingBag, User, Store, Shield, Sparkles, MapPin, ChevronDown, Percent, Flame, Crown } from "lucide-react";

const searchPlaceholders = [
  "Search 'Hyderabadi Biryani'",
  "Search 'Smash Cheeseburger'",
  "Search 'Woodfired Pizza'",
  "Search 'Dal Makhani'",
  "Search 'Garlic Bread'",
];

export default function Navbar() {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    switchRole,
    cart,
    searchQuery,
    setSearchQuery,
    getItemTotal,
  } = useApp();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedAddressLabel, setSelectedAddressLabel] = useState("Home");

  // Cycle search placeholders smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const cartItemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Swiggy-style Location Selector */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div
              onClick={() => setCurrentTab("explore")}
              className="flex items-center gap-2 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                FX
              </div>
              <div className="hidden sm:block">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block leading-none">
                  Food<span className="text-orange-500">X</span>
                </span>
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest block mt-0.5">
                  Live Kitchens
                </span>
              </div>
            </div>

            {/* Location Selector (Swiggy Signature Feature) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 text-left py-1 px-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <MapPin size={16} className="text-orange-500 shrink-0" />
                <div className="max-w-[130px] sm:max-w-[200px] truncate">
                  <div className="flex items-center gap-1 text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    <span>{selectedAddressLabel}</span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-900 transition-transform" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {currentUser.address?.street || "Sector 62, Noida"}
                  </div>
                </div>
              </button>

              {/* Location Selector Dropdown */}
              {showLocationDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fade-in flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Delivery Destination
                  </div>
                  {[
                    { label: "Home", street: "Flat 402, Green Valley Apts, Sector 62, Noida" },
                    { label: "Office", street: "Tower 5, Tech Mahindra Cyber Park, Sector 62" },
                    { label: "Other", street: "DLF Galleria, Phase 4, Gurugram" },
                  ].map((loc) => (
                    <div
                      key={loc.label}
                      onClick={() => {
                        setSelectedAddressLabel(loc.label);
                        setShowLocationDropdown(false);
                      }}
                      className="p-2 rounded-xl hover:bg-orange-50 cursor-pointer flex items-start gap-2 transition-colors"
                    >
                      <MapPin size={15} className="text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{loc.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight line-clamp-1">{loc.street}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Animated Search Bar (Desktop / Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholders[placeholderIndex]}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-orange-400 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Actions Bar & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* FoodX Gold / One Loyalty Pill */}
            <div className="hidden xl:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-full text-xs font-black">
              <Crown size={14} className="text-amber-500 fill-amber-500" />
              <span>FoodX Gold</span>
            </div>

            {/* Persona Switcher Chips */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => switchRole("customer")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  currentUser.role === "customer"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <User size={13} className="text-blue-500" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("restaurantOwner")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  currentUser.role === "restaurantOwner"
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Store size={13} className="text-orange-500" />
                <span>Merchant</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole("admin")}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  currentUser.role === "admin"
                    ? "bg-white text-purple-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Shield size={13} className="text-purple-600" />
                <span>Admin</span>
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentTab("explore")}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentTab === "explore"
                    ? "bg-orange-50 text-orange-600 font-black"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Discover
              </button>

              <button
                onClick={() => setCurrentTab("orders")}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentTab === "orders"
                    ? "bg-orange-50 text-orange-600 font-black"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Orders
              </button>

              {currentUser.role === "restaurantOwner" && (
                <button
                  onClick={() => setCurrentTab("partner")}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    currentTab === "partner"
                      ? "bg-orange-50 text-orange-600 font-black"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Kitchen KDS
                </button>
              )}

              {currentUser.role === "admin" && (
                <button
                  onClick={() => setCurrentTab("admin")}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    currentTab === "admin"
                      ? "bg-purple-50 text-purple-600 font-black"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Admin
                </button>
              )}
            </div>

            {/* Swiggy-Style Floating Cart Button */}
            <button
              type="button"
              onClick={() => setCurrentTab("cart")}
              className={`relative p-2.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                cartItemCount > 0
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center text-[11px] font-black">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => setCurrentTab("profile")}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Profile & Settings"
            >
              <User size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholders[placeholderIndex]}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
