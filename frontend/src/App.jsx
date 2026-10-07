import React from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ExploreView from "./components/ExploreView.jsx";
import RestaurantView from "./components/RestaurantView.jsx";
import CartView from "./components/CartView.jsx";
import CheckoutView from "./components/CheckoutView.jsx";
import OrdersView from "./components/OrdersView.jsx";
import PartnerView from "./components/PartnerView.jsx";
import AdminView from "./components/AdminView.jsx";
import ProfileView from "./components/ProfileView.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import RoleMatrixInfo from "./components/RoleMatrixInfo.jsx";
import FloatingCartBar from "./components/FloatingCartBar.jsx";

function MainApp() {
  const { currentTab, toast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Interactive Backend RBAC Capability Matrix */}
        <RoleMatrixInfo />

        {/* Dynamic Views with Role-Guards */}
        {currentTab === "explore" && <ExploreView />}
        {currentTab === "restaurant" && <RestaurantView />}
        {currentTab === "cart" && <CartView />}
        {currentTab === "checkout" && <CheckoutView />}
        {currentTab === "orders" && <OrdersView />}

        {currentTab === "partner" && (
          <RoleGuard
            allowedRoles={["restaurantOwner", "owner", "admin"]}
            fallbackMessage="The Kitchen Display & Merchant Menu Management suite is protected by backend verifyOwnerOrAdmin middleware and requires restaurantOwner credentials."
          >
            <PartnerView />
          </RoleGuard>
        )}

        {currentTab === "admin" && (
          <RoleGuard
            allowedRoles={["admin"]}
            fallbackMessage="The Super Admin Platform Overview & GMV Governance console is protected by backend verifyAdmin middleware and is strictly restricted to platform administrators."
          >
            <AdminView />
          </RoleGuard>
        )}

        {currentTab === "profile" && <ProfileView />}
      </main>

      {/* Swiggy-Style Floating Bottom Sticky Cart Bar */}
      <FloatingCartBar />

      {/* Floating Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-black flex items-center gap-2 border ${
              toast.type === "error"
                ? "bg-red-900 text-white border-red-700"
                : "bg-slate-900 text-white border-slate-700"
            }`}
          >
            <span>{toast.type === "error" ? "⚠️" : "✨"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
