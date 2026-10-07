import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { Shield, User, Store, Check, Lock, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export default function RoleMatrixInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, switchRole } = useApp();

  const matrix = [
    {
      feature: "Food Discovery & Search",
      customer: true,
      merchant: true,
      admin: true,
      desc: "Search restaurants, dishes, cuisines & dietary filters",
    },
    {
      feature: "Cart & Order Placement",
      customer: true,
      merchant: false,
      admin: true,
      desc: "Add items, apply coupons, select address & pay (POST /api/v1/orders)",
    },
    {
      feature: "Customer Reviews & Ratings",
      customer: true,
      merchant: false,
      admin: true,
      desc: "Post 1-5 star reviews on restaurants (POST /api/v1/reviews)",
    },
    {
      feature: "Live Kitchen KDS Display",
      customer: false,
      merchant: true,
      admin: true,
      desc: "Accept incoming tickets & mark prep status (PUT /api/v1/orders/:id/status)",
    },
    {
      feature: "Menu & Dish Inventory Management",
      customer: false,
      merchant: true,
      admin: true,
      desc: "Add new dishes & toggle instant out-of-stock (POST/PUT /api/v1/foods)",
    },
    {
      feature: "Outlet Operational Settings",
      customer: false,
      merchant: true,
      admin: true,
      desc: "Manage FSSAI licenses, timings & payout accounts (POST /api/v1/restaurants/register)",
    },
    {
      feature: "Global GMV Analytics & Governance",
      customer: false,
      merchant: false,
      admin: true,
      desc: "Platform-wide orders audit, 20% take-rate telemetry (GET /api/v1/orders/admin/all)",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm my-6">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Backend Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Current active role: <strong className="text-orange-600 uppercase font-black">{currentUser?.role}</strong> ({currentUser?.firstName})
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-4 animate-fade-in">
          <p className="text-xs text-slate-600 leading-relaxed">
            The backend strictly validates JWT tokens via <code className="text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded">verifyJwt</code> and checks roles with <code className="text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded">verifyOwnerOrAdmin</code> & <code className="text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded">verifyAdmin</code>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Backend Capability</th>
                  <th className="py-2.5 px-3 text-center">Customer</th>
                  <th className="py-2.5 px-3 text-center">Merchant</th>
                  <th className="py-2.5 px-3 text-center">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{row.feature}</div>
                      <div className="text-[11px] text-slate-400">{row.desc}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.customer ? (
                        <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.merchant ? (
                        <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.admin ? (
                        <span className="inline-flex p-1 rounded-full bg-purple-100 text-purple-700">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">Fast Persona Switch:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => switchRole("customer")}
                className="px-3 py-1 bg-white border border-slate-200 hover:border-orange-400 rounded-lg text-xs font-bold text-slate-800 cursor-pointer"
              >
                👤 Customer (Priya)
              </button>
              <button
                type="button"
                onClick={() => switchRole("restaurantOwner")}
                className="px-3 py-1 bg-white border border-slate-200 hover:border-orange-400 rounded-lg text-xs font-bold text-orange-600 cursor-pointer"
              >
                🍳 Merchant (Rajesh)
              </button>
              <button
                type="button"
                onClick={() => switchRole("admin")}
                className="px-3 py-1 bg-white border border-slate-200 hover:border-purple-400 rounded-lg text-xs font-bold text-purple-600 cursor-pointer"
              >
                🛡️ Admin (Anita)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
