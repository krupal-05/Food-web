import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Star,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurant.service.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error: toastError } = useToast();

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data || []);
    } catch (err) {
      console.error('Failed to load all restaurants:', err);
      toastError('Could not fetch restaurants list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `ADMIN WARNING: Are you sure you want to permanently delete "${name}"? This will delete the restaurant and cascade delete all its food items.`
      )
    )
      return;

    try {
      await restaurantService.deleteRestaurant(id);
      setRestaurants(restaurants.filter((r) => r._id !== id));
      success(`Restaurant "${name}" deleted from platform`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to delete restaurant');
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.address?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-1">
            Merchant Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Platform Restaurants
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee all registered food outlets, verify operating parameters, and manage listings
          </p>
        </div>

        <Button onClick={loadRestaurants} variant="outline" size="sm" icon={RotateCcw}>
          Refresh Outlets
        </Button>
      </div>

      {/* Search Bar & Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Total Outlets:</span>
          <span className="text-sm font-black text-slate-900">{restaurants.length}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-emerald-600">
            {restaurants.filter((r) => r.isOpen).length} Active Online
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search outlet name, cuisine, city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Restaurants Table */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Restaurants Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Cuisine</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Owner Contact</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRestaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Restaurant Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img
                            src={
                              rest.image ||
                              rest.imageUrl ||
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
                            }
                            alt={rest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{rest.name}</p>
                          <Link
                            to={`/restaurant/${rest._id}`}
                            className="text-[10px] text-purple-600 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>View Public Menu</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Cuisine */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {rest.cuisine}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {rest.address?.city || '—'}
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">
                        {rest.owner?.firstName} {rest.owner?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400">{rest.phone}</p>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{rest.rating ? rest.rating.toFixed(1) : '4.5'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge color={rest.isOpen ? 'success' : 'danger'} size="sm" dot>
                        {rest.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rest._id, rest.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete restaurant from platform"
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

export default AdminRestaurants;
