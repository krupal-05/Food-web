import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Minus, Check, Clock, Store } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import Badge from '../common/Badge.jsx';

export const FoodCard = ({ food }) => {
  const { addToCart, updateQuantity, getItemQuantity, isUpdating } = useCart();
  const { isCustomer, isAuthenticated } = useAuth();

  const quantity = getItemQuantity(food._id);

  const isVeg = food.foodType === 'veg';
  const isVegan = food.foodType === 'vegan';

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(food._id, 1, food.name);
  };

  const handleIncrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateQuantity(food._id, quantity - 1);
  };

  const restaurantName = food.restaurant?.name || 'Partner Kitchen';
  const restaurantId = food.restaurant?._id || food.restaurant;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Food Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
          alt={food.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center p-0.5 ${
              isVegan
                ? 'border-emerald-600'
                : isVeg
                ? 'border-green-600'
                : 'border-rose-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isVegan
                  ? 'bg-emerald-600'
                  : isVeg
                  ? 'bg-green-600'
                  : 'bg-rose-600'
              }`}
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 pr-0.5">
            {isVegan ? 'Vegan' : isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Rating Badge */}
        {food.rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-black text-slate-900">{food.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Unavailable Overlay */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <Badge color="danger" size="md">
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Restaurant */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-bold uppercase tracking-wider text-orange-600 text-[10px]">
            {food.category}
          </span>
          {restaurantId && (
            <Link
              to={`/restaurant/${restaurantId}`}
              className="flex items-center gap-1 hover:text-slate-700 transition-colors truncate max-w-[140px]"
              title={restaurantName}
            >
              <Store className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{restaurantName}</span>
            </Link>
          )}
        </div>

        {/* Food Name */}
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
          {food.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {food.description || 'Prepared with fresh ingredients and aromatic spices by master chefs.'}
        </p>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Price
            </span>
            <span className="text-lg font-black text-slate-950 font-['Outfit']">
              ₹{food.price}
            </span>
          </div>

          {/* Cart Interaction Controls */}
          {food.isAvailable ? (
            quantity > 0 && isAuthenticated && isCustomer ? (
              <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl p-1 gap-2 shadow-inner">
                <button
                  onClick={handleDecrement}
                  disabled={isUpdating}
                  className="w-7 h-7 rounded-lg bg-white text-orange-700 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black text-slate-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={isUpdating}
                  className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="text-xs font-bold text-slate-400 italic">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
