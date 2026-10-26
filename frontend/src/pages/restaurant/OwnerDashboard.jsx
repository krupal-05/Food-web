import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  TrendingUp,
  Store,
  Plus,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Power,
  ChevronRight,
} from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service.js';
import { orderService } from '../../services/order.service.js';
import { foodService } from '../../services/food.service.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUS_CONFIG } from '../../constants/order.constants.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foodCount, setFoodCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const { success, error: toastError } = useToast();

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [ownedRestaurants, incomingOrders] = await Promise.all([
        restaurantService.getMyRestaurants(),
        orderService.getRestaurantOrders(),
      ]);

      setRestaurants(ownedRestaurants || []);
      setOrders(incomingOrders || []);

      // If owner has restaurants, fetch foods count
      if (ownedRestaurants?.length > 0) {
        let totalItems = 0;
        for (const rest of ownedRestaurants) {
          try {
            const foods = await foodService.getFoodsByRestaurant(rest._id);
            totalItems += foods?.length || 0;
          } catch {
            // continue
          }
        }
        setFoodCount(totalItems);
      }
    } catch (err) {
      console.error('Failed to load owner metrics:', err);
      toastError('Could not refresh dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const primaryRestaurant = restaurants[0] || null;

  // Toggle Restaurant Open/Closed Status
  const handleToggleOpenStatus = async () => {
    if (!primaryRestaurant) return;

    try {
      setIsTogglingStatus(true);
      const newStatus = !primaryRestaurant.isOpen;
      const updated = await restaurantService.updateRestaurant(primaryRestaurant._id, {
        isOpen: newStatus,
      });

      setRestaurants(restaurants.map((r) => (r._id === primaryRestaurant._id ? updated : r)));
      success(`Restaurant is now ${newStatus ? 'OPEN for orders' : 'CLOSED'}`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to toggle restaurant status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Quick Order Status Advancement
  const handleQuickAdvanceStatus = async (orderId, nextStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, { status: nextStatus });
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      success(`Order updated to ${nextStatus.replace('_', ' ')}`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to update order status');
    }
  };

  // Statistics Computations
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const kitchenOrders = orders.filter((o) =>
    ['confirmed', 'preparing', 'ready'].includes(o.status)
  );
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  // If Owner doesn't have a registered restaurant yet
  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-xl mx-auto shadow-sm my-8">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 font-black">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
          No Registered Restaurant Found
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
          You haven't registered your kitchen outlet yet. Register your restaurant profile to begin listing food items and accepting customer orders.
        </p>
        <Link to="/owner/restaurants">
          <Button variant="primary" size="md" icon={Plus}>
            Register Your Restaurant Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
            Kitchen Operating Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            {primaryRestaurant.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {primaryRestaurant.cuisine} •{' '}
            {primaryRestaurant.address?.city || 'Mumbai'}
          </p>
        </div>

        {/* Status Toggle & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleOpenStatus}
            disabled={isTogglingStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
              primaryRestaurant.isOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{primaryRestaurant.isOpen ? 'ONLINE (Accepting)' : 'OFFLINE (Closed)'}</span>
          </button>

          <Button onClick={loadDashboardData} variant="outline" size="sm" icon={RotateCcw}>
            Sync
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Pending Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Tickets
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {pendingOrders.length}
            </p>
            <p className="text-[11px] text-amber-600 font-bold mt-1">Needs confirmation</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: In Kitchen */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Kitchen Prep
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {kitchenOrders.length}
            </p>
            <p className="text-[11px] text-purple-600 font-bold mt-1">Preparing & Ready</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Food Items */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Menu Items
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {foodCount}
            </p>
            <Link
              to="/owner/foods"
              className="text-[11px] text-orange-600 font-bold hover:underline mt-1 block"
            >
              Manage dishes →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fulfilled Volume
            </p>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              ₹{totalRevenue}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {completedOrders.length} Completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/owner/foods"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Add Menu Item</h3>
              <p className="text-[10px] text-slate-400">Upload photo and price</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
        </Link>

        <Link
          to="/owner/orders"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Kitchen Display</h3>
              <p className="text-[10px] text-slate-400">Track and dispatch orders</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
        </Link>

        <Link
          to="/owner/restaurants"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Outlet Profile</h3>
              <p className="text-[10px] text-slate-400">Hours, min order, address</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </Link>
      </div>

      {/* Live Active Kitchen Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">
              Live Kitchen Tickets
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Orders requiring immediate kitchen preparation and dispatch
            </p>
          </div>
          <Link
            to="/owner/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
          >
            <span>View All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No incoming orders currently. Kitchen tickets will stream here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                    label: order.status,
                    color: 'bg-slate-100 text-slate-700',
                  };

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 font-black text-slate-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">{order.userId?.phone || 'No Phone'}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-700">
                          {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-black text-slate-900 font-['Outfit'] text-sm">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleQuickAdvanceStatus(order._id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Accept & Cook
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleQuickAdvanceStatus(order._id, 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleQuickAdvanceStatus(order._id, 'out_for_delivery')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Dispatch
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => handleQuickAdvanceStatus(order._id, 'delivered')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Delivered
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-[11px] font-bold text-emerald-600">
                            Completed ✓
                          </span>
                        )}
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

export default OwnerDashboard;
