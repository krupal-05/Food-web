import React from "react";
import { useApp } from "../context/AppContext.jsx";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function FloatingCartBar() {
  const { cart, currentTab, setCurrentTab, grandTotal } = useApp();

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  // Hide when cart is empty or when already on cart/checkout tabs
  if (cartCount === 0 || currentTab === "cart" || currentTab === "checkout") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-50 animate-fade-in">
      <div
        onClick={() => setCurrentTab("cart")}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-95"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-white">
              {cartCount} {cartCount === 1 ? "Item" : "Items"} • ₹{grandTotal}
            </div>
            <div className="text-[11px] text-emerald-100 line-clamp-1">
              From {cart.restaurantName || "Express Kitchen"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs sm:text-sm font-black bg-white/20 px-3 py-1.5 rounded-xl">
          <span>View Cart</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
