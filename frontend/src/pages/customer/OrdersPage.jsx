import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Clock,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
  Store,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { orderService } from '../../services/order.service.js';
import { useToast } from '../../hooks/useToast.js';
import { ORDER_STATUS_CONFIG } from '../../constants/order.constants.js';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toastError('Could not fetch order history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // Cancel Pending Order
  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      const updatedOrder = await orderService.cancelOrder(orderId);
      setOrders(orders.map((o) => (o._id === orderId ? updatedOrder : o)));
      setConfirmCancelId(null);
      success('Order cancelled successfully');
    } catch (err) {
      toastError(err.extractedMessage || 'Could not cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={PackageCheck}
          title="No Orders Yet"
          description="You haven't placed any orders so far. Explore delicious cuisines from local kitchens!"
          actionLabel="Order Your First Meal"
          onAction={() => (window.location.href = '/menu')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-['Outfit']">
            Your Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking {orders.length} order history records
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline" size="sm" icon={RotateCcw}>
          Refresh
        </Button>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.map((order) => {
          const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
            label: order.status,
            color: 'bg-slate-100 text-slate-700',
            dotColor: 'bg-slate-400',
            description: '',
          };

          const isPending = order.status === 'pending';
          const restaurantName = order.restaurantId?.name || 'Restaurant';

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col gap-6"
            >
              {/* Card Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{restaurantName}</h3>
                    <p className="text-xs text-slate-400">
                      Order #{order._id.slice(-6).toUpperCase()} •{' '}
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${statusConfig.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>
              </div>

              {/* Items List Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Items ({order.items?.length || 0})
                  </span>
                  <div className="divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-black text-orange-600 w-5">{item.quantity}x</span>
                          <span className="font-bold text-slate-800">
                            {item.name || item.foodId?.name || 'Dish'}
                          </span>
                        </div>
                        <span className="font-black text-slate-900 font-['Outfit']">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address snippet */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 mt-2 border-t border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.city} -{' '}
                      {order.deliveryAddress?.pincode}
                    </span>
                  </div>
                </div>

                {/* Amount and Cancel Action */}
                <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block md:text-right">
                      Total Paid ({order.paymentMethod?.toUpperCase()})
                    </span>
                    <span className="text-2xl font-black text-slate-950 font-['Outfit'] block md:text-right">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                  {isPending && (
                    <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                      {confirmCancelId === order._id ? (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-2 rounded-xl">
                          <span className="text-xs text-rose-700 font-medium">Cancel order?</span>
                          <Button
                            onClick={() => handleCancelOrder(order._id)}
                            isLoading={cancellingOrderId === order._id}
                            variant="danger"
                            size="sm"
                            className="!py-1 !px-2.5 text-xs"
                          >
                            Yes, Cancel
                          </Button>
                          <Button
                            onClick={() => setConfirmCancelId(null)}
                            variant="ghost"
                            size="sm"
                            className="!py-1 !px-2 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Keep Order
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setConfirmCancelId(order._id)}
                          variant="outline"
                          size="sm"
                          className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
