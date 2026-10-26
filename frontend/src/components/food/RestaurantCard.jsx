import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Restaurant Banner Image */}
      <div className="relative w-full h-44 overflow-hidden bg-slate-100">
        <img
          src={
            restaurant.image ||
            restaurant.imageUrl ||
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
          }
          alt={restaurant.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black text-slate-900">
            {restaurant.rating ? restaurant.rating.toFixed(1) : '4.5'}
          </span>
        </div>

        {/* Status Badge */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <Badge color="danger" size="md">
              Closed Now
            </Badge>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
              {restaurant.name}
            </h3>
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md flex-shrink-0">
              {restaurant.cuisine}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {restaurant.address?.street
                ? `${restaurant.address.street}, ${restaurant.address.city}`
                : restaurant.address?.city || 'Local Kitchen'}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{restaurant.deliveryTime || 30} mins</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Min: <span className="font-bold text-slate-700">₹{restaurant.minOrder || 100}</span>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
