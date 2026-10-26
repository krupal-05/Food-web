import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Search,
  Trash2,
  Store,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { foodService } from '../../services/food.service.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { success, error: toastError } = useToast();

  const loadFoods = async () => {
    try {
      setIsLoading(true);
      const data = await foodService.getAllFoods();
      setFoods(data || []);
    } catch (err) {
      console.error('Failed to load global foods:', err);
      toastError('Could not fetch foods catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the platform?`))
      return;

    try {
      await foodService.deleteFood(id);
      setFoods(foods.filter((f) => f._id !== id));
      success(`"${name}" removed from platform`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to delete dish');
    }
  };

  // Categories
  const categories = React.useMemo(() => {
    const set = new Set();
    foods.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['All', ...Array.from(set)];
  }, [foods]);

  const filteredFoods = foods.filter((f) => {
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.restaurant?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-1">
            Catalog Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Global Food Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and moderate all menu dishes listed across platform restaurants
          </p>
        </div>

        <Button onClick={loadFoods} variant="outline" size="sm" icon={RotateCcw}>
          Refresh Catalog
        </Button>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or restaurant..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Foods Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filteredFoods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <UtensilsCrossed className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Food Items Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category or clearing search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Dish</th>
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Dish */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={
                              food.image ||
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
                            }
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{food.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                            {food.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Restaurant */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {food.restaurant?.name || 'Kitchen Outlet'}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {food.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${
                          food.foodType === 'vegan'
                            ? 'text-emerald-600'
                            : food.foodType === 'veg'
                            ? 'text-green-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {food.foodType === 'vegan'
                          ? '🌱 Vegan'
                          : food.foodType === 'veg'
                          ? '🟢 Veg'
                          : '🔴 Non-Veg'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-black text-slate-900 font-['Outfit'] text-sm">
                      ₹{food.price}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge color={food.isAvailable ? 'success' : 'danger'} size="sm" dot>
                        {food.isAvailable ? 'In Stock' : 'Sold Out'}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(food._id, food.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete dish from platform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;
