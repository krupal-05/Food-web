import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  MessageSquarePlus,
  Send,
  UtensilsCrossed,
} from 'lucide-react';
import { restaurantService } from '../../services/restaurant.service.js';
import { reviewService } from '../../services/review.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import FoodCard from '../../components/food/FoodCard.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import { FoodCardSkeleton } from '../../components/common/Skeleton.jsx';

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error: toastError } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      const [resData, revData] = await Promise.all([
        restaurantService.getRestaurantById(id),
        reviewService.getRestaurantReviews(id),
      ]);

      setRestaurant(resData);
      setFoods(resData.foods || []);
      setReviews(revData || []);
    } catch (err) {
      console.error('Failed to load restaurant details:', err);
      toastError('Could not load restaurant menu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  // Categories for this restaurant
  const categories = React.useMemo(() => {
    const set = new Set();
    foods.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['All', ...Array.from(set)];
  }, [foods]);

  const filteredFoods = React.useMemo(() => {
    if (selectedCategory === 'All') return foods;
    return foods.filter((f) => f.category === selectedCategory);
  }, [foods, selectedCategory]);

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toastError('Please log in to submit a review');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const newReview = await reviewService.addReview({
        restaurantId: id,
        rating: Number(rating),
        comment: comment.trim(),
      });

      setReviews([newReview, ...reviews]);
      success('Review submitted successfully!');
      setIsReviewModalOpen(false);
      setComment('');
      setRating(5);
      // Reload to get updated average rating
      const updatedRes = await restaurantService.getRestaurantById(id);
      setRestaurant(updatedRes);
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FoodCardSkeleton count={6} />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Restaurant Not Found</h2>
        <Link to="/" className="text-orange-600 font-bold text-sm mt-3 inline-block">
          ← Back to all restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </Link>

      {/* Restaurant Header Banner Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-48 sm:h-64 w-full overflow-hidden bg-slate-900 relative">
          <img
            src={
              restaurant.image ||
              restaurant.imageUrl ||
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
            }
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Info overlay */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex-1">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-orange-400 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg mb-2">
              {restaurant.cuisine}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 sm:text-white font-['Outfit'] tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 sm:text-slate-300 mt-2 max-w-xl leading-relaxed">
              {restaurant.description ||
                'Authentic cuisine crafted with pride and passion by master culinary artisans.'}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-bold text-slate-600 sm:text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-100 sm:bg-slate-900/80 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-slate-900 sm:text-white font-black">
                  {restaurant.rating?.toFixed(1) || '4.5'}
                </span>
                <span className="text-slate-400 font-normal">
                  ({restaurant.totalReviews || reviews.length} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 sm:bg-slate-900/80 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{restaurant.deliveryTime || 30} mins delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 sm:bg-slate-900/80 px-3 py-1.5 rounded-xl">
                <span>Min Order: ₹{restaurant.minOrder || 100}</span>
              </div>
            </div>
          </div>

          {/* Action / Review Button */}
          {isAuthenticated && isCustomer && (
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              variant="outline"
              size="md"
              icon={MessageSquarePlus}
            >
              Write a Review
            </Button>
          )}
        </div>
      </div>

      {/* Menu Categories Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950 font-['Outfit']">Restaurant Menu</h2>
          <span className="text-xs font-bold text-slate-400">{filteredFoods.length} Items</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
          <UtensilsCrossed className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No dishes in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={{ ...food, restaurant }} />
          ))}
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-slate-200 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950 font-['Outfit']">Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified dining feedback from registered food lovers
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-xs text-slate-500">
            No reviews yet for this restaurant. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">
                      {rev.user?.firstName || 'Food Lover'}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.comment || 'Delicious and freshly prepared meal!'}"
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 mt-4 block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${restaurant.name}`}
        subtitle="Share your honest dining feedback"
      >
        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Star Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                  />
                </button>
              ))}
              <span className="text-sm font-black text-slate-900 ml-2">{rating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the food flavor, packaging, and delivery time?"
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingReview}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantDetailPage;
