import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
} from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service.js';
import { foodService } from '../../services/food.service.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const FoodManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error: toastError } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFoodId, setActiveFoodId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    foodType: 'veg',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load owned restaurants
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const owned = await restaurantService.getMyRestaurants();
      setRestaurants(owned || []);

      if (owned?.length > 0) {
        const firstId = owned[0]._id;
        setSelectedRestaurantId(firstId);
        const foodItems = await foodService.getFoodsByRestaurant(firstId);
        setFoods(foodItems || []);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
      toastError('Could not load menu catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // When selected restaurant changes, reload foods
  const handleRestaurantChange = async (restId) => {
    setSelectedRestaurantId(restId);
    try {
      setIsLoading(true);
      const foodItems = await foodService.getFoodsByRestaurant(restId);
      setFoods(foodItems || []);
    } catch (err) {
      toastError('Failed to fetch foods for this restaurant');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    if (!selectedRestaurantId) {
      toastError('Please register a restaurant first');
      return;
    }
    setIsEditing(false);
    setActiveFoodId(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      foodType: 'veg',
      isAvailable: true,
    });
    setImageFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setIsEditing(true);
    setActiveFoodId(food._id);
    setFormData({
      name: food.name || '',
      category: food.category || '',
      price: String(food.price || 0),
      description: food.description || '',
      foodType: food.foodType || 'veg',
      isAvailable: food.isAvailable !== undefined ? food.isAvailable : true,
    });
    setImageFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Dish name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      errors.price = 'Valid price is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category.trim());
      data.append('price', formData.price);
      data.append('description', formData.description.trim());
      data.append('foodType', formData.foodType);
      data.append('isAvailable', formData.isAvailable);
      data.append('restaurantId', selectedRestaurantId);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        const updated = await foodService.updateFood(activeFoodId, data);
        setFoods(foods.map((f) => (f._id === activeFoodId ? updated : f)));
        success('Food item updated successfully!');
      } else {
        const created = await foodService.addFoodItem(data);
        setFoods([created, ...foods]);
        success('Dish added to restaurant menu!');
      }

      setIsModalOpen(false);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to save food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Availability Inline
  const handleToggleAvailability = async (food) => {
    try {
      const updated = await foodService.updateFood(food._id, {
        isAvailable: !food.isAvailable,
      });
      setFoods(foods.map((f) => (f._id === food._id ? updated : f)));
      success(`${food.name} is now ${!food.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to toggle availability');
    }
  };

  // Delete Food
  const handleDeleteFood = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from your menu?`)) return;

    try {
      await foodService.deleteFood(id);
      setFoods(foods.filter((f) => f._id !== id));
      success(`${name} deleted from menu`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to delete food item');
    }
  };

  const filteredFoods = foods.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.category?.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
            Menu Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Food Items Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add gourmet dishes, adjust prices, upload imagery, and toggle stock availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => handleRestaurantChange(selectedRestaurantId)} variant="outline" size="sm" icon={RotateCcw}>
            Sync
          </Button>
          <Button onClick={openCreateModal} variant="primary" size="sm" icon={Plus}>
            Add Food Item
          </Button>
        </div>
      </div>

      {/* Select Restaurant & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Restaurant Dropdown Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Outlet:</span>
          <select
            value={selectedRestaurantId}
            onChange={(e) => handleRestaurantChange(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.cuisine})
              </option>
            ))}
          </select>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Food Items Table */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredFoods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <UtensilsCrossed className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Food Items Listed</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Add signature dishes to your restaurant menu so customers can start ordering.
          </p>
          <Button onClick={openCreateModal} variant="primary" size="md" icon={Plus}>
            Add First Dish
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Dish</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Dish Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
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
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {food.description || 'Delicious freshly prepared recipe'}
                          </p>
                        </div>
                      </div>
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
                        className={`text-[11px] font-black uppercase tracking-wider ${
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

                    {/* Availability Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAvailability(food)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border ${
                          food.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            food.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{food.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food._id, food.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Food Item' : 'Add New Food Item'}
        subtitle="Specify recipe name, category, pricing, and photo"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Dish Name"
            required
            placeholder="e.g. Truffle Pepperoni Pizza"
            value={formData.name}
            error={formErrors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              required
              placeholder="e.g. Pizza, Burger, Indian"
              value={formData.category}
              error={formErrors.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="Price (₹)"
              type="number"
              required
              placeholder="299"
              value={formData.price}
              error={formErrors.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Dietary Food Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'veg', label: '🟢 Veg' },
                { id: 'non-veg', label: '🔴 Non-Veg' },
                { id: 'vegan', label: '🌱 Vegan' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setFormData({ ...formData, foodType: t.id })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.foodType === t.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            type="textarea"
            label="Recipe Description"
            rows={2}
            placeholder="Key ingredients, allergens, preparation notes..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Image Upload */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Dish Image Upload (Cloudinary)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
            />
          </div>

          {/* In Stock Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 border-slate-300 cursor-pointer"
            />
            <label
              htmlFor="isAvailable"
              className="text-xs font-bold text-slate-800 cursor-pointer"
            >
              Dish is currently available in stock
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Add Dish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoodManagement;
