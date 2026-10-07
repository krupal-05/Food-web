import React from "react";
import { useApp } from "../context/AppContext.jsx";
import { ShieldAlert, Store, User, ArrowRight, Sparkles } from "lucide-react";

export default function RoleGuard({ allowedRoles, fallbackMessage, children }) {
  const { currentUser, switchRole, setCurrentTab } = useApp();

  const userRole = currentUser?.role?.toLowerCase();
  const isAllowed =
    currentUser?.role === "admin" ||
    allowedRoles.map((r) => r.toLowerCase()).includes(userRole) ||
    (allowedRoles.includes("restaurantOwner") && userRole === "owner");

  if (isAllowed) {
    return children;
  }

  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
        <ShieldAlert size={36} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Role-Based Access Restricted
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          {fallbackMessage ||
            `This section requires ${allowedRoles.join(" or ")} privileges. You are currently logged in as ${
              currentUser?.firstName || "a"
            } (${currentUser?.role || "guest"}).`}
        </p>
      </div>

      {/* 1-Tap Fast Role Switcher */}
      <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2 mt-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-orange-500" />
          <span>Switch to an Authorized Persona:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {allowedRoles.includes("restaurantOwner") && (
            <button
              type="button"
              onClick={() => switchRole("restaurantOwner")}
              className="p-2.5 bg-white border border-slate-200 hover:border-orange-400 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Store size={15} className="text-orange-500" />
              <span>Login as Merchant</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => switchRole("admin")}
            className="p-2.5 bg-white border border-slate-200 hover:border-purple-400 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Login as Super Admin</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCurrentTab("explore")}
        className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        ← Return to Consumer Discovery
      </button>
    </div>
  );
}
