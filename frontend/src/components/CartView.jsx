import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Plus, Minus, ArrowLeft, Trash2, Tag, ArrowRight, Heart, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";

export default function CartView() {
  const {
    cart,
    setCart,
    updateCartItemQty,
    clearCart,
    applyPromo,
    getItemTotal,
    packagingFee,
    deliveryFee,
    gstTax,
    grandTotal,
    setCurrentTab,
    showToast,
  } = useApp();

  const [promoInput, setPromoInput] = useState("");
  const [tipAmount, setTipAmount] = useState(30);
  const [optNoContact, setOptNoContact] = useState(false);
  const [optCutlery, setOptCutlery] = useState(false);

  const finalPayable = grandTotal + tipAmount;

  if (cart.items.length === 0) {
    return (
      <div className="p-8 sm:p-16 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto min-h-[50vh]">
        <div className="text-6xl animate-bounce">🛍️</div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
          Good food is always cooking! Explore top restaurants near you and add dishes to your feast.
        </p>
        <button
          type="button"
          onClick={() => setCurrentTab("explore")}
          className="mt-2 py-3 px-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab("explore")}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {cart.restaurantName || "Express Feast"}
            </h1>
            <p className="text-xs text-slate-500">
              {cart.items.length} unique item(s) in feast basket
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Clear Basket</span>
        </button>
      </div>

      {/* Cart Items List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs divide-y divide-slate-100">
        {cart.items.map((item, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center shrink-0 ${
                  item.food.foodType === "veg" ? "border-emerald-600" : "border-red-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.food.foodType === "veg" ? "bg-emerald-600" : "bg-red-600"
                  }`}
                />
              </span>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {item.food.name}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  ₹{item.price} each
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {/* Stepper */}
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateCartItemQty(idx, -1)}
                  className="w-6 h-6 rounded-lg bg-white text-orange-600 flex items-center justify-center font-black hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="text-xs font-black text-orange-700 min-w-[16px] text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartItemQty(idx, 1)}
                  className="w-6 h-6 rounded-lg bg-white text-orange-600 flex items-center justify-center font-black hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>

              <div className="text-sm sm:text-base font-black text-slate-900 min-w-[65px] text-right">
                ₹{item.itemTotal}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Partner Tip (Swiggy / Zomato Signature) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-500 fill-red-500" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Tip Your Delivery Partner
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          100% of your tip goes directly to the delivery rider who braves traffic and weather.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "₹20", value: 20 },
            { label: "₹30 ⭐", value: 30 },
            { label: "₹50 💖", value: 50 },
            { label: "None", value: 0 },
          ].map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => {
                setTipAmount(t.value);
                showToast(`Tip set to ₹${t.value}`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                tipAmount === t.value
                  ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Eco-Friendly Options */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 justify-between">
        <div
          onClick={() => setOptNoContact(!optNoContact)}
          className="flex items-start gap-3 cursor-pointer select-none flex-1"
        >
          <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
            optNoContact ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300"
          }`}>
            {optNoContact && <Check size={14} strokeWidth={3} />}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Opt in for No-Contact Delivery</div>
            <div className="text-xs text-slate-500">Rider will drop package at doorstep & ring bell</div>
          </div>
        </div>

        <div
          onClick={() => setOptCutlery(!optCutlery)}
          className="flex items-start gap-3 cursor-pointer select-none flex-1"
        >
          <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
            optCutlery ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300"
          }`}>
            {optCutlery && <Check size={14} strokeWidth={3} />}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">Don't send plastic cutlery</div>
            <div className="text-xs text-slate-500">Help the environment by saying no to disposables</div>
          </div>
        </div>
      </div>

      {/* Cooking Note Input */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          📝 Cooking Instructions & Special Requests
        </label>
        <input
          type="text"
          value={cart.cookingNotes || ""}
          onChange={(e) => setCart({ ...cart, cookingNotes: e.target.value })}
          placeholder="e.g. Less spicy, extra onions, hot gravy..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {/* Promo Code Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Apply Coupon Promo
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="Enter coupon (e.g. FOODX50)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 uppercase outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              applyPromo(promoInput);
              setPromoInput("");
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>

        {cart.promoDiscount > 0 && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between">
            <span>✓ Promo '{cart.promoCode}' Applied</span>
            <span className="text-emerald-700 font-black">-₹{cart.promoDiscount}</span>
          </div>
        )}
      </div>

      {/* Swiggy-Style Detailed Bill Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          Detailed Invoice Bill
        </h3>

        <div className="flex justify-between text-xs sm:text-sm text-slate-700">
          <span>Item Total</span>
          <span className="font-bold text-slate-900">₹{getItemTotal()}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-700">
          <span>Delivery Partner Fee {getItemTotal() > 299 && <strong className="text-emerald-600 font-bold">(FREE)</strong>}</span>
          <span className="font-bold text-slate-900">
            {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-700">
          <span>Restaurant Packaging Charge</span>
          <span className="font-bold text-slate-900">₹{packagingFee}</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-700">
          <span>Platform Delivery Fee</span>
          <span className="font-bold text-slate-900">₹5</span>
        </div>

        <div className="flex justify-between text-xs sm:text-sm text-slate-700">
          <span>Govt Taxes & GST (5%)</span>
          <span className="font-bold text-slate-900">₹{gstTax}</span>
        </div>

        {tipAmount > 0 && (
          <div className="flex justify-between text-xs sm:text-sm text-slate-700">
            <span>Rider Tip</span>
            <span className="font-bold text-slate-900">₹{tipAmount}</span>
          </div>
        )}

        {cart.promoDiscount > 0 && (
          <div className="flex justify-between text-xs sm:text-sm text-emerald-600 font-bold">
            <span>Coupon Promo Savings</span>
            <span>-₹{cart.promoDiscount}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base sm:text-lg font-black text-slate-900">
          <span>Total Amount to Pay</span>
          <span className="text-xl sm:text-2xl text-orange-600 font-black">₹{finalPayable + 5}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        onClick={() => setCurrentTab("checkout")}
        className="py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span>₹{finalPayable + 5}</span>
          <span className="text-xs text-orange-100 font-normal">• {cart.items.length} Unique Dishes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Select Address & Pay</span>
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}
