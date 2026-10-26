export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    dotColor: 'bg-amber-500',
    description: 'Order placed, awaiting restaurant acceptance',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    dotColor: 'bg-blue-500',
    description: 'Order confirmed by restaurant',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    dotColor: 'bg-purple-500',
    description: 'Kitchen is preparing your meal',
  },
  ready: {
    label: 'Ready for Pickup',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    dotColor: 'bg-indigo-500',
    description: 'Packed and waiting for delivery agent',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    dotColor: 'bg-cyan-500',
    description: 'Delivery partner is on the way',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotColor: 'bg-emerald-500',
    description: 'Delivered successfully',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    dotColor: 'bg-rose-500',
    description: 'Order was cancelled',
  },
};

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay with cash or UPI on delivery' },
  { id: 'online', label: 'Instant Online Pay', desc: 'UPI, Credit/Debit Card, Netbanking' },
];

export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurantOwner',
  ADMIN: 'admin',
};
