import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, CheckCircle2, ChevronRight, Smartphone, Wallet } from "lucide-react";

export default function CheckoutView() {
  const {
    currentUser,
    cart,
    grandTotal,
    placeOrder,
    setCurrentTab,
    showToast,
  } = useApp();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: currentUser.address?.street || "Flat 402, Green Valley, Sector 62",
    city: currentUser.address?.city || "Noida",
    pincode: currentUser.address?.pincode || "201309",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi | online | card | cod
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.street.trim() || !deliveryAddress.city.trim() || !deliveryAddress.pincode.trim()) {
      showToast("Complete address (street, city, pincode) is required", "error");
      return;
    }

    setSubmitting(true);
    await placeOrder(deliveryAddress, paymentMethod);
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentTab("cart")}
          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Checkout & Confirmation
          </h1>
          <p className="text-xs text-slate-500">
            Ordering from {cart.restaurantName || "Express Feast"}
          </p>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="flex flex-col gap-6">
        {/* Delivery Address Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin size={18} className="text-orange-500" />
            <span>Delivery Destination Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">House / Flat / Area</label>
              <input
                type="text"
                required
                value={deliveryAddress.street}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={deliveryAddress.city}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                maxLength={6}
                value={deliveryAddress.pincode}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-500" />
            <span>Select Payment Mode</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* UPI */}
            <div
              onClick={() => setPaymentMethod("upi")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "upi"
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Smartphone size={18} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Instant UPI Payment</div>
                  <div className="text-xs text-slate-500">Google Pay, PhonePe, Paytm, CRED</div>
                </div>
              </div>
              {paymentMethod === "upi" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>

            {/* FastPay Wallet */}
            <div
              onClick={() => setPaymentMethod("online")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "online"
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                  <Wallet size={18} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">FoodX FastPay Wallet</div>
                  <div className="text-xs text-slate-500">Balance: ₹{currentUser.walletBalance || 500}</div>
                </div>
              </div>
              {paymentMethod === "online" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>

            {/* Cards */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "card"
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Credit / Debit Card</div>
                  <div className="text-xs text-slate-500">Visa, Mastercard, RuPay</div>
                </div>
              </div>
              {paymentMethod === "card" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === "cod"
                  ? "border-orange-500 bg-orange-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  💵
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">Cash on Delivery (COD)</div>
                  <div className="text-xs text-slate-500">Pay cash or scan QR at doorstep</div>
                </div>
              </div>
              {paymentMethod === "cod" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>
          </div>
        </div>

        {/* Place Order CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payable</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              ₹{grandTotal}
            </div>
            <span className="text-[11px] text-slate-400">Includes taxes, packaging & platform fees</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-4 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>{submitting ? "Transmitting..." : "Place Order & Transmit to Kitchen"}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
