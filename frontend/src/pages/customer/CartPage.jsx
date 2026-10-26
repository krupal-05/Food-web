import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  Store,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { orderService } from '../../services/order.service.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export const CartPage = () => {
  const { cart, items, totalAmount, updateQuantity, removeItem, clearCart, isUpdating } = useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Checkout Delivery Address Form State (Pre-fills from user's profile address if available)
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || '',
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod'); // "cod" or "online"
  const [instructions, setInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Delivery and Taxes Calculation
  const deliveryFee = totalAmount > 299 || totalAmount === 0 ? 0 : 40;
  const platformFee = totalAmount > 0 ? 15 : 0;
  const grandTotal = totalAmount + deliveryFee + platformFee;

  // Validate Address
  const validateAddress = () => {
    const errors = {};
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      errors.pincode = 'Pincode must be exactly 6 digits';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Place Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toastError('Your cart is empty');
      return;
    }

    if (!validateAddress()) {
      toastError('Please provide a complete 6-digit delivery address');
      return;
    }

    // Determine target restaurant ID from the first item
    const firstFood = items[0]?.food;
    const targetRestaurantId =
      firstFood?.restaurant?._id || firstFood?.restaurant || items[0]?.foodId?.restaurant;

    try {
      setIsPlacingOrder(true);

      const orderPayload = {
        restaurantId: targetRestaurantId,
        items: items.map((ci) => ({
          foodId: ci.food?._id || ci.foodId?._id || ci.foodId,
          name: ci.food?.name || ci.foodId?.name || 'Dish',
          quantity: ci.quantity,
          price: ci.food?.price || ci.foodId?.price || 0,
        })),
        deliveryAddress: {
          street: address.street.trim(),
          city: address.city.trim(),
          pincode: address.pincode.trim(),
        },
        paymentMethod,
        instructions: instructions.trim(),
      };

      const placedOrder = await orderService.placeOrder(orderPayload);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas-confetti canvas blocked
      }

      success('Order placed successfully! Kitchen has received your ticket.');
      // Refresh local cart state
      await clearCart();
      navigate('/orders');
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to place order. Please check minimum order amount.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any delicious food to your cart yet. Explore our restaurant menus to get started!"
          actionLabel="Explore Delicious Food"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  // Restaurant reference for minimum order check
  const restaurant = items[0]?.food?.restaurant || items[0]?.foodId?.restaurant;
  const restaurantName = typeof restaurant === 'object' ? restaurant?.name : 'Kitchen';
  const minOrder = typeof restaurant === 'object' ? restaurant?.minOrder || 100 : 100;
  const meetsMinOrder = totalAmount >= minOrder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-['Outfit']">
            Checkout & Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reviewing items from <span className="font-bold text-slate-800">{restaurantName}</span>
          </p>
        </div>
        <Link
          to="/menu"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Selected Dishes ({items.length})
              </span>
              <button
                onClick={clearCart}
                disabled={isUpdating}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer disabled:opacity-50"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const food = item.food || item.foodId;
                const foodId = food?._id || item.foodId;
                const itemTotal = (food?.price || 0) * item.quantity;

                return (
                  <div key={item._id || foodId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={food?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                        alt={food?.name || 'Dish'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {food?.name || 'Delicious Dish'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">₹{food?.price || 0} each</p>

                      {/* Line Item Total (Mobile view) */}
                      <span className="text-xs font-black text-slate-900 sm:hidden block mt-1">
                        Total: ₹{itemTotal}
                      </span>
                    </div>

                    {/* Quantity Selector Controls */}
                    <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl p-1 gap-2 shadow-inner">
                      <button
                        onClick={() => updateQuantity(foodId, item.quantity - 1)}
                        disabled={isUpdating}
                        className="w-6 h-6 rounded-lg bg-white text-orange-700 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-slate-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(foodId, item.quantity + 1)}
                        disabled={isUpdating}
                        className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total & Remove (Desktop view) */}
                    <div className="hidden sm:flex flex-col items-end w-20">
                      <span className="text-sm font-black text-slate-900 font-['Outfit']">
                        ₹{itemTotal}
                      </span>
                      <button
                        onClick={() => removeItem(foodId, food?.name)}
                        disabled={isUpdating}
                        className="text-slate-400 hover:text-rose-500 transition-colors mt-1 p-1"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Chef & Delivery Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Less spicy, leave at the front door, call upon arrival..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Right Column: Delivery Address, Payment & Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Delivery Address Form Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Delivery Address
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <Input
                label="Street / Flat / Building"
                required
                placeholder="402, Lotus Apartments, MG Road"
                value={address.street}
                error={addressErrors.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City"
                  required
                  placeholder="Mumbai"
                  value={address.city}
                  error={addressErrors.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <Input
                  label="Pincode (6-digit)"
                  required
                  placeholder="400001"
                  value={address.pincode}
                  error={addressErrors.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">
              Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  {paymentMethod === 'cod' && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Pay upon arrival</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'online'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  {paymentMethod === 'online' && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Instant Online</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">UPI / Cards / Netbanking</p>
                </div>
              </button>
            </div>
          </div>

          {/* Bill Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-extrabold uppercase text-[10px]">
                      FREE
                    </span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Governance Fee</span>
                <span className="font-bold text-slate-900">₹{platformFee}</span>
              </div>
            </div>

            {/* Total Row */}
            <div className="pt-4 flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  To Pay
                </p>
                <p className="text-2xl font-black text-slate-950 font-['Outfit']">
                  ₹{grandTotal}
                </p>
              </div>
              {deliveryFee === 0 && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  Free Delivery Unlocked!
                </span>
              )}
            </div>

            {/* Minimum Order Alert if not met */}
            {!meetsMinOrder && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold leading-snug">
                ⚠️ Minimum order amount for {restaurantName} is ₹{minOrder}. Add ₹
                {minOrder - totalAmount} more to proceed.
              </div>
            )}

            {/* Place Order CTA */}
            <Button
              onClick={handlePlaceOrder}
              disabled={!meetsMinOrder || isPlacingOrder}
              isLoading={isPlacingOrder}
              variant="primary"
              size="lg"
              className="w-full"
              icon={ArrowRight}
            >
              Place Order • ₹{grandTotal}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
