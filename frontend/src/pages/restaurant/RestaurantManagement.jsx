import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Power,
  Upload,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeRestaurantId, setActiveRestaurantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    phone: '',
    description: '',
    deliveryTime: '30',
    minOrder: '100',
    street: '',
    city: '',
    pincode: '',
    isOpen: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await restaurantService.getMyRestaurants();
      setRestaurants(data || []);
    } catch (err) {
      console.error('Failed to load owned restaurants:', err);
      toastError('Could not fetch restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setActiveRestaurantId(null);
    setFormData({
      name: '',
      cuisine: '',
      phone: '',
      description: '',
      deliveryTime: '30',
      minOrder: '100',
      street: '',
      city: '',
      pincode: '',
      isOpen: true,
    });
    setImageFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (rest) => {
    setIsEditing(true);
    setActiveRestaurantId(rest._id);
    setFormData({
      name: rest.name || '',
      cuisine: rest.cuisine || '',
      phone: rest.phone || '',
      description: rest.description || '',
      deliveryTime: String(rest.deliveryTime || 30),
      minOrder: String(rest.minOrder || 100),
      street: rest.address?.street || '',
      city: rest.address?.city || '',
      pincode: rest.address?.pincode || '',
      isOpen: rest.isOpen !== undefined ? rest.isOpen : true,
    });
    setImageFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Restaurant name is required';
    if (!formData.cuisine.trim()) errors.cuisine = 'Cuisine type is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.street.trim()) errors.street = 'Street is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Pincode must be exactly 6 digits';
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
      data.append('cuisine', formData.cuisine.trim());
      data.append('phone', formData.phone.trim());
      data.append('description', formData.description.trim());
      data.append('deliveryTime', formData.deliveryTime);
      data.append('minOrder', formData.minOrder);
      data.append('isOpen', formData.isOpen);

      data.append(
        'address',
        JSON.stringify({
          street: formData.street.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        })
      );

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        const updated = await restaurantService.updateRestaurant(activeRestaurantId, data);
        setRestaurants(restaurants.map((r) => (r._id === activeRestaurantId ? updated : r)));
        success('Restaurant profile updated successfully!');
      } else {
        const created = await restaurantService.registerRestaurant(data);
        setRestaurants([created, ...restaurants]);
        success('Restaurant registered successfully!');
      }

      setIsModalOpen(false);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to save restaurant details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}? This will permanently remove all associated food items as well.`
      )
    )
      return;

    try {
      await restaurantService.deleteRestaurant(id);
      setRestaurants(restaurants.filter((r) => r._id !== id));
      success(`${name} and its menu items deleted`);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to delete restaurant');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 block mb-1">
            Outlet Profiles
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Restaurant Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register and update kitchen addresses, minimum order criteria, and operating hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={loadRestaurants} variant="outline" size="sm" icon={RotateCcw}>
            Refresh
          </Button>
          <Button onClick={openCreateModal} variant="primary" size="sm" icon={Plus}>
            Register Restaurant
          </Button>
        </div>
      </div>

      {/* Restaurants List */}
      {isLoading ? (
        <TableSkeleton rows={3} cols={4} />
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Outlets Registered</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Register your first restaurant to start receiving hungry customer orders.
          </p>
          <Button onClick={openCreateModal} variant="primary" size="md" icon={Plus}>
            Register Outlet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={
                    rest.image ||
                    rest.imageUrl ||
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
                  }
                  alt={rest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge color={rest.isOpen ? 'success' : 'danger'} size="sm" dot>
                    {rest.isOpen ? 'Accepting Orders' : 'Offline / Closed'}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {rest.name}
                    </h3>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {rest.cuisine}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {rest.description || 'No description provided.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        {rest.address?.street}, {rest.address?.city} - {rest.address?.pincode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{rest.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>
                        Delivery: {rest.deliveryTime || 30} mins • Min Order: ₹
                        {rest.minOrder || 100}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    onClick={() => openEditModal(rest)}
                    variant="outline"
                    size="sm"
                    icon={Edit2}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(rest._id, rest.name)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Restaurant Profile' : 'Register New Restaurant'}
        subtitle="Provide accurate merchant details for customer discovery"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Restaurant Name"
              required
              placeholder="e.g. Saffron Bistro"
              value={formData.name}
              error={formErrors.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Cuisine Type"
              required
              placeholder="e.g. Italian, Indian, Asian"
              value={formData.cuisine}
              error={formErrors.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Phone Number"
              required
              placeholder="9876543210"
              value={formData.phone}
              error={formErrors.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Est. Delivery (Mins)"
              type="number"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
            />
            <Input
              label="Min Order (₹)"
              type="number"
              value={formData.minOrder}
              onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
            />
          </div>

          <Input
            type="textarea"
            label="Short Description"
            rows={2}
            placeholder="Tell food lovers about your signature flavors..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Address Fields */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Outlet Physical Address
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Street"
                required
                placeholder="104 MG Road"
                value={formData.street}
                error={formErrors.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <Input
                label="City"
                required
                placeholder="Mumbai"
                value={formData.city}
                error={formErrors.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="Pincode (6-digit)"
                required
                placeholder="400001"
                value={formData.pincode}
                error={formErrors.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Banner Photo (Upload or keep existing)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
            />
          </div>

          {/* Open/Closed Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOpen"
              checked={formData.isOpen}
              onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
              className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="isOpen" className="text-xs font-bold text-slate-800 cursor-pointer">
              Open for immediate ordering
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Register Outlet'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantManagement;
