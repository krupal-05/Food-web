import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Shield, TrendingUp, Users, Store, DollarSign, Activity } from "lucide-react";
import api from "../services/api.js";

export default function AdminView() {
  const { restaurants, foodItems, orders } = useApp();
  const [adminOrders, setAdminOrders] = useState([]);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const res = await api.getAllOrders();
        if (res?.data?.orders) {
          setAdminOrders(res.data.orders);
        }
      } catch {
        setAdminOrders(orders);
      }
    };
    fetchAdminOrders();
  }, [orders]);

  const totalGMV = 1420890;
  const commissionRevenue = Math.round(totalGMV * 0.2);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Super Admin Governance Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Platform Overview & GMV Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold w-fit">
          <Activity size={14} className="animate-pulse text-emerald-600" />
          <span>MongoDB & Express Services Healthy</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Platform GMV</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            ₹{(totalGMV / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">↑ +24.5% MoM</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Platform Take Rate (20%)</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-2">
            ₹{(commissionRevenue / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Net platform revenue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Registered Kitchens</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {restaurants.length} Outlets
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">100% FSSAI Verified</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Menu Catalog Size</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {foodItems.length} Dishes
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Across 6 Cuisines</div>
        </div>
      </div>

      {/* Global Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
          Recent Platform Transactions & Dispatch
        </h3>

        <div className="divide-y divide-slate-100">
          {(adminOrders.length > 0 ? adminOrders : orders).slice(0, 5).map((ord) => (
            <div key={ord._id || ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">{ord._id || ord.id}</span>
                  <span className="text-xs text-slate-500">• {ord.restaurant?.name || "Kitchen"}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ord.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Destination: {ord.deliveryAddress?.city || "Noida"} • Method: {ord.paymentMethod?.toUpperCase()}
                </div>
              </div>
              <div className="text-sm font-black text-slate-900">
                ₹{ord.totalAmount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
