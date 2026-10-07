import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Clock, Bike, CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, MapPin, Phone, ShieldCheck, Sparkles, Navigation } from "lucide-react";
import api from "../services/api.js";

export default function OrdersView() {
  const {
    orders,
    setOrders,
    cancelOrder,
    setCurrentTab,
    showToast,
  } = useApp();

  const [graceSeconds, setGraceSeconds] = useState(85);
  const [gpsProgress, setGpsProgress] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setGraceSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bike GPS animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGpsProgress((prev) => (prev < 92 ? prev + 3 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch orders from backend if logged in
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res?.data?.orders) {
          setOrders(res.data.orders);
        }
      } catch {
        // use local
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { text: "Grace Cancellation (120s)", class: "bg-amber-100 text-amber-800" };
      case "confirmed":
      case "preparing":
        return { text: "🍳 Cooking in Kitchen", class: "bg-orange-100 text-orange-800" };
      case "ready":
        return { text: "📦 Packed & Waiting for Rider", class: "bg-blue-100 text-blue-800" };
      case "out_for_delivery":
        return { text: "🛵 Rider on Way to Doorstep", class: "bg-emerald-100 text-emerald-800 animate-pulse" };
      case "delivered":
        return { text: "✓ Delivered Hot & Fresh", class: "bg-emerald-100 text-emerald-800" };
      case "cancelled":
        return { text: "✕ Cancelled", class: "bg-red-100 text-red-700" };
      default:
        return { text: status, class: "bg-slate-100 text-slate-700" };
    }
  };

  const steps = [
    { label: "Order Placed & Confirmed", done: true, time: "10:14 PM" },
    { label: "Kitchen is Preparing Food", done: true, time: "10:20 PM" },
    { label: "Rider Picked Up Package", done: true, active: true, time: "10:26 PM" },
    { label: "Delivered to Doorstep", done: false, time: "ETA 10:38 PM" },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Live Order Tracking & History
        </h1>
        <p className="text-xs text-slate-500">
          Real-time GPS telemetry, kitchen prep status & invoices
        </p>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl">
            <div className="text-5xl mb-2">🍽️</div>
            <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1">Cravings? Order your favorite meal now</p>
            <button
              type="button"
              onClick={() => setCurrentTab("explore")}
              className="mt-4 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const ordId = order._id || order.id;
            const badge = getStatusBadge(order.status);
            const isPending = order.status === "pending";
            const isLive = ["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(order.status);

            return (
              <div
                key={ordId}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-5"
              >
                {/* Order Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {order.restaurant?.name || order.restaurantName || "Biryani by Kilo"}
                      </h3>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      ID: {ordId} • {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    ₹{order.totalAmount}
                  </div>
                </div>

                {/* Swiggy-Style Live GPS Courier Map Visual (if live) */}
                {isLive && (
                  <div className="bg-slate-950 text-white rounded-2xl p-5 relative overflow-hidden shadow-inner flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-bold text-slate-300">Live Delivery Route</span>
                      </div>
                      <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-black px-2.5 py-0.5 rounded-lg">
                        ETA ~12 MINS
                      </div>
                    </div>

                    {/* Progress Track Line */}
                    <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                        style={{ width: `${gpsProgress}%` }}
                      />
                    </div>

                    {/* Rider Card & Handover OTP */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          alt="Rider"
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-500/30"
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white">Vikram Sharma (Rider)</div>
                          <div className="text-[11px] text-slate-400">Hero Electric • UP 16 DX 8920</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="bg-slate-900 border border-slate-700 px-3.5 py-1.5 rounded-xl text-center">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Delivery OTP</span>
                          <span className="text-sm font-black text-amber-400 tracking-widest font-mono">4829</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast("Calling Vikram (+91 98112 34567)...")}
                          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition-colors cursor-pointer"
                        >
                          <Phone size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-500">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Destination & Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={13} className="text-orange-500" />
                    <span>{order.deliveryAddress?.street || "Sector 62, Noida"}</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {isPending && graceSeconds > 0 && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(ordId)}
                        className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel ({graceSeconds}s)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => showToast(`Invoice receipt downloaded for order ${ordId}`)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
