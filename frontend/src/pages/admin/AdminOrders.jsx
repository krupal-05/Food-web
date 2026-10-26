import React, { useState, useEffect } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  RotateCcw,
  Store,
  User,
  Clock,
  Phone,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { orderService } from '../../services/order.service.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUS_CONFIG, ORDER_STATUSES } from '../../constants/order.constants.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load global orders:', err);
      toastError('Could not fetch global order ledger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const updated = await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      success(`Order updated to ${newStatus}`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatusTab !== 'all' && order.status !== selectedStatusTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderId = order._id.toLowerCase();
      const customer = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
      const restaurant = order.restaurantId?.name?.toLowerCase() || '';
      return orderId.includes(q) || customer.includes(q) || restaurant.includes(q);
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-1">
            Fulfillment Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Global Order Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit, status overrides, and dispute management across all platform transactions
          </p>
        </div>

        <Button onClick={loadOrders} variant="outline" size="sm" icon={RotateCcw}>
          Refresh Ledger
        </Button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'preparing', label: 'Preparing' },
            { id: 'ready', label: 'Ready' },
            { id: 'out_for_delivery', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => {
            const count =
              tab.id === 'all' ? orders.length : orders.filter((o) => o.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedStatusTab === tab.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    selectedStatusTab === tab.id
                      ? 'bg-purple-700 text-purple-200'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, restaurant..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Orders in this Status</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting another filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Status Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                    label: order.status,
                    color: 'bg-slate-100 text-slate-700',
                  };

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 block font-['Outfit']">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Restaurant */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {order.restaurantId?.name || 'Kitchen'}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">{order.userId?.email}</p>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 font-['Outfit'] text-sm block">
                          ₹{order.totalAmount}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Status Override Dropdown */}
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-700 cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
