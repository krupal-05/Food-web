import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  UtensilsCrossed,
  X,
  RotateCcw,
} from 'lucide-react';
import { foodService } from '../../services/food.service.js';
import FoodCard from '../../components/food/FoodCard.jsx';
import { FoodCardSkeleton } from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import useDebounce from '../../hooks/useDebounce.js';

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFoodType, setSelectedFoodType] = useState('all'); // all, veg, non-veg, vegan
  const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc, rating

  // Data State
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 350);

  // Sync category param change from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load foods with backend filters
  const loadFoods = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedFoodType && selectedFoodType !== 'all') params.foodType = selectedFoodType;

      const data = await foodService.getAllFoods(params);
      setFoods(data || []);
    } catch (err) {
      console.error('Failed to load foods:', err);
      setError('Unable to fetch food items from server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, [debouncedSearch, selectedCategory, selectedFoodType]);

  // Extract all categories dynamically from catalog
  const availableCategories = useMemo(() => {
    const set = new Set();
    foods.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    // Ensure base categories are included
    ['Pizza', 'Burger', 'Indian', 'Chinese', 'Desserts', 'Beverages'].forEach((c) => set.add(c));
    return ['All', ...Array.from(set)];
  }, [foods]);

  // Client-side Sort
  const sortedFoods = useMemo(() => {
    const list = [...foods];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [foods, sortBy]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFoodType('all');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedFoodType !== 'all' ||
    sortBy !== 'default';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-['Outfit']">
            Explore Full Menu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover {foods.length} handcrafted dishes made with fresh ingredients
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pizza, burger, biryani..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Horizontal Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {availableCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? '🍽️ All Foods' : cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Food Type & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Food Type Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Type:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'veg', label: '🟢 Veg Only' },
            { id: 'non-veg', label: '🔴 Non-Veg' },
            { id: 'vegan', label: '🌱 Vegan' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedFoodType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                selectedFoodType === type.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown & Reset Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer border-b border-slate-300 py-1"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Foods Grid / State Display */}
      {isLoading ? (
        <FoodCardSkeleton count={8} />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center max-w-lg mx-auto">
          <p className="text-sm font-bold text-rose-700 mb-4">{error}</p>
          <button
            onClick={loadFoods}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
          >
            Retry Loading Menu
          </button>
        </div>
      ) : sortedFoods.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No food matches found"
          description="We couldn't find any dish matching your active search or filters. Try resetting your criteria."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
