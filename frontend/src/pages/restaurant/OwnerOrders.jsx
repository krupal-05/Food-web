import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Utensils,
  ChevronDown,
} from 'lucide-react';
import { orderService } from '../../services/order.service.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUS_CONFIG, ORDER_STATUSES } from '../../constants/order.constants.js';
import Button from '../../components/common/Button.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getRestaurantOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load kitchen orders:', err);
      toastError('Could not load incoming orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const updated = await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      success(`Order marked as ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status Filter
    if (selectedStatusTab !== 'all' && order.status !== selectedStatusTab) {
      return false;
    }

    // Search Query (ID or Customer name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customerName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
      const orderId = order._id.toLowerCase();
      return customerName.includes(q) || orderId.includes(q);
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
            Kitchen Display System (KDS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Order Fulfillment Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process active kitchen tickets, update dish cooking states, and dispatch meals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadOrders} variant="outline" size="sm" icon={RotateCcw}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Tickets' },
            { id: 'pending', label: 'Pending' },
            { id: 'preparing', label: 'In Kitchen' },
            { id: 'ready', label: 'Ready for Pickup' },
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    selectedStatusTab === tab.id
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order # or customer..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Orders in this Status</h3>
          <p className="text-xs text-slate-500 mt-1">
            Incoming tickets will update automatically when customers place new orders.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
              label: order.status,
              color: 'bg-slate-100 text-slate-700',
              dotColor: 'bg-slate-400',
            };

            const isUpdating = updatingOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col gap-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      Ticket #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusConfig.color}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Customer Information */}
                  <div className="md:col-span-4 space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Customer Info
                    </span>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {order.userId?.firstName} {order.userId?.lastName}
                    </p>
                    <p className="text-slate-500">{order.userId?.email}</p>
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.userId?.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city} -{' '}
                        {order.deliveryAddress?.pincode}
                      </span>
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="md:col-span-5 space-y-2 text-xs border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Dishes ({order.items?.length || 0})
                    </span>
                    <div className="divide-y divide-slate-100">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-orange-600 w-5">
                              {item.quantity}x
                            </span>
                            <span className="font-bold text-slate-800">
                              {item.name || item.foodId?.name}
                            </span>
                          </div>
                          <span className="font-black text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.instructions && (
                      <p className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-amber-900 text-[11px] font-medium mt-2">
                        <span className="font-bold">Note:</span> {order.instructions}
                      </p>
                    )}
                  </div>

                  {/* Total & Action Workflow Controls */}
                  <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block md:text-right">
                        Total Amount
                      </span>
                      <span className="text-2xl font-black text-slate-950 font-['Outfit'] block md:text-right">
                        ₹{order.totalAmount}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block md:text-right">
                        {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                      </span>
                    </div>

                    {/* Step-by-Step Status Transition Controls */}
                    <div className="flex flex-col gap-2 w-full mt-4">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'preparing')}
                            disabled={isUpdating}
                            className="w-full py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            Accept & Start Cooking
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                            disabled={isUpdating}
                            className="w-full py-1.5 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Decline Ticket
                          </button>
                        </>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'ready')}
                          disabled={isUpdating}
                          className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          Mark Ready for Delivery
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'out_for_delivery')}
                          disabled={isUpdating}
                          className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          Dispatch with Driver
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'delivered')}
                          disabled={isUpdating}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          Confirm Delivered
                        </button>
                      )}

                      {order.status === 'delivered' && (
                        <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center">
                          Order Completed ✓
                        </div>
                      )}

                      {order.status === 'cancelled' && (
                        <div className="w-full py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black text-center">
                          Ticket Cancelled ✕
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;
