import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CATEGORY_IMAGES = {
  Pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
  Burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  Indian: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
  Chinese: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
  Desserts: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400',
  Beverages: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400',
  'South Indian': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
};

export const CategoryCard = ({ category, count, image }) => {
  const displayImage =
    image ||
    CATEGORY_IMAGES[category] ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';

  return (
    <Link
      to={`/menu?category=${encodeURIComponent(category)}`}
      className="group relative bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col items-center text-center cursor-pointer overflow-hidden"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-3 bg-slate-100 shadow-inner">
        <img
          src={displayImage}
          alt={category}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      <h4 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight line-clamp-1">
        {category}
      </h4>

      {count !== undefined && (
        <span className="text-[11px] font-bold text-slate-400 mt-0.5">
          {count} {count === 1 ? 'Dish' : 'Dishes'}
        </span>
      )}

      <div className="mt-2 w-6 h-6 rounded-full bg-slate-50 group-hover:bg-orange-500 group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300">
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
};

export default CategoryCard;
