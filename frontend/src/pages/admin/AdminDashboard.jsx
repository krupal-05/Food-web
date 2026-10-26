import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  UtensilsCrossed,
  PackageCheck,
  TrendingUp,
  Clock,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { authService } from '../../services/auth.service.js';
import { restaurantService } from '../../services/restaurant.service.js';
import { foodService } from '../../services/food.service.js';
import { orderService } from '../../services/order.service.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUS_CONFIG } from '../../constants/order.constants.js';
import Button from '../../components/common/Button.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error: toastError } = useToast();

  const loadPlatformMetrics = async () => {
    try {
      setIsLoading(true);
      const [allUsers, allRestaurants, allFoods, allOrders] = await Promise.all([
        authService.getAllUsers(),
        restaurantService.getAllRestaurants(),
        foodService.getAllFoods(),
        orderService.getAllOrders(),
      ]);

      setUsers(allUsers || []);
      setRestaurants(allRestaurants || []);
      setFoods(allFoods || []);
      setOrders(allOrders || []);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
      toastError('Could not refresh platform metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformMetrics();
  }, []);

  // Aggregated Computations
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalOwners = users.filter((u) =>
    ['restaurantowner', 'owner', 'restaurant_owner'].includes(u.role?.toLowerCase())
  ).length;

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const inPrepOrders = orders.filter((o) =>
    ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  const totalGMV = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-1">
            Global Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Platform Overview & GMV
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ecosystem metrics across customers, merchants, menus, and deliveries
          </p>
        </div>

        <Button onClick={loadPlatformMetrics} variant="outline" size="sm" icon={RotateCcw}>
          Sync Metrics
        </Button>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Users & Customers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Accounts
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {users.length}
            </p>
            <p className="text-[11px] text-purple-600 font-bold mt-1">
              {totalCustomers} Customers • {totalOwners} Merchants
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Restaurants */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Outlets
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {restaurants.length}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {restaurants.filter((r) => r.isOpen).length} Open for orders
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Food Items */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Menu Catalog
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {foods.length}
            </p>
            <p className="text-[11px] text-orange-600 font-bold mt-1">Across all categories</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Total GMV Volume */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fulfilled GMV
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              ₹{totalGMV}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {completedOrders} Delivered • {orders.length} Total
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">User Directory</h3>
              <p className="text-[10px] text-slate-400">{users.length} Registered Accounts</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </Link>

        <Link
          to="/admin/restaurants"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Restaurants</h3>
              <p className="text-[10px] text-slate-400">{restaurants.length} Verified Outlets</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </Link>

        <Link
          to="/admin/foods"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Food Catalog</h3>
              <p className="text-[10px] text-slate-400">{foods.length} Dishes Listed</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Global Orders</h3>
              <p className="text-[10px] text-slate-400">{orders.length} System Tickets</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </Link>
      </div>

      {/* Recent Platform Orders Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Latest System Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live transactions across all merchant outlets
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No orders placed on the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Outlet</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                    label: order.status,
                    color: 'bg-slate-100 text-slate-700',
                  };

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-black text-slate-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {order.restaurantId?.name || 'Kitchen'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {order.items?.length || 0} items
                      </td>
                      <td className="py-3 px-3 font-black text-slate-900 font-['Outfit']">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
