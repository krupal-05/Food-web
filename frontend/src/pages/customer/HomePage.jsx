import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Utensils,
  Flame,
  Search,
  Store,
} from 'lucide-react';
import { foodService } from '../../services/food.service.js';
import { restaurantService } from '../../services/restaurant.service.js';
import FoodCard from '../../components/food/FoodCard.jsx';
import CategoryCard from '../../components/food/CategoryCard.jsx';
import RestaurantCard from '../../components/food/RestaurantCard.jsx';
import Button from '../../components/common/Button.jsx';
import { FoodCardSkeleton } from '../../components/common/Skeleton.jsx';

export const HomePage = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoadingFoods, setIsLoadingFoods] = useState(true);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial recommended foods and top restaurants from live backend
  const loadHomeData = async () => {
    try {
      setError(null);
      setIsLoadingFoods(true);
      setIsLoadingRestaurants(true);

      const [foodsData, restaurantsData] = await Promise.all([
        foodService.getAllFoods(),
        restaurantService.getAllRestaurants(),
      ]);

      setFoods(foodsData || []);
      setRestaurants(restaurantsData || []);
    } catch (err) {
      console.error('Failed to load home data:', err);
      setError('Unable to reach the food network. Please check your connection.');
    } finally {
      setIsLoadingFoods(false);
      setIsLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  // Compute unique dynamic categories from actual live foods
  const categoriesWithCounts = React.useMemo(() => {
    const map = {};
    foods.forEach((f) => {
      if (f.category) {
        map[f.category] = (map[f.category] || 0) + 1;
      }
    });

    const entries = Object.entries(map).map(([name, count]) => ({
      name,
      count,
    }));

    // If categories are loaded from foods
    if (entries.length > 0) return entries;

    // Fallback standard categories if catalog is still populating
    return [
      { name: 'Pizza', count: 3 },
      { name: 'Burger', count: 3 },
      { name: 'Indian', count: 3 },
      { name: 'Chinese', count: 3 },
      { name: 'Desserts', count: 2 },
      { name: 'Beverages', count: 1 },
    ];
  }, [foods]);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-12 sm:pb-20">
        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-rose-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-black tracking-wide uppercase mb-6 shadow-xs animate-in fade-in">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                <span>Superfast Hyperlocal Food Delivery</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] font-['Outfit'] mb-6">
                Fresh, Piping-Hot Meals Delivered to Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500">
                  Doorstep.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
                Satisfy your cravings with handcrafted artisanal pizzas, sizzling gourmet burgers, authentic biryanis, and decadent desserts from your neighborhood's highest-rated kitchens.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link to="/menu">
                  <Button variant="primary" size="lg" icon={ArrowRight}>
                    Explore Menu
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button variant="outline" size="lg" icon={Utensils}>
                    Order Now
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-slate-200/80 w-full max-w-lg">
                <div>
                  <p className="text-2xl font-black text-slate-900 font-['Outfit']">30 Min</p>
                  <p className="text-xs font-bold text-slate-500">Average Delivery</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 font-['Outfit']">100%</p>
                  <p className="text-xs font-bold text-slate-500">Hygienic Kitchens</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 font-['Outfit']">4.8 ★</p>
                  <p className="text-xs font-bold text-slate-500">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Dish Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-4/3 sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000"
                    alt="Delicious Gourmet Cuisine"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Floating Highlight Banner */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-orange-600 tracking-wider">
                        Chef's Selection
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        Artisan Truffle Pepperoni
                      </p>
                    </div>
                    <span className="text-base font-black text-slate-950 font-['Outfit']">
                      ₹499
                    </span>
                  </div>
                </div>

                {/* Floating Micro Badge 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Express Delivery</p>
                    <p className="text-[11px] text-slate-500">Under 30 Minutes</p>
                  </div>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Contactless Delivery</p>
                    <p className="text-[11px] text-slate-500">Safe & Sanitized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Popular Cuisines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
              Explore Food Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categoriesWithCounts.map((cat) => (
            <CategoryCard
              key={cat.name}
              category={cat.name}
              count={cat.count}
            />
          ))}
        </div>
      </section>

      {/* 3. RECOMMENDED FOOD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Top Rated Dishes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
              Recommended For You
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>Explore All Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Foods Grid */}
        {isLoadingFoods ? (
          <FoodCardSkeleton count={8} />
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
            <p className="text-sm font-bold text-rose-700 mb-3">{error}</p>
            <Button onClick={loadHomeData} variant="outline" size="sm">
              Retry Connection
            </Button>
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto">
            <Utensils className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Food Items Found</h3>
            <p className="text-xs text-slate-500 mt-1">Our chefs are preparing fresh recipes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.slice(0, 8).map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED RESTAURANTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
              Verified Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
              Top Neighborhood Kitchens
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {restaurants.length} Verified Outlets
          </span>
        </div>

        {/* Restaurants Grid */}
        {isLoadingRestaurants ? (
          <FoodCardSkeleton count={4} />
        ) : restaurants.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center max-w-md mx-auto">
            <Store className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-xs text-slate-500">No restaurants currently available in this zone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* 5. VALUE PROPOSITION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 mb-2 block">
              Own a Kitchen or Restaurant?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] tracking-tight mb-4">
              Partner with FoodX and grow your culinary business.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Access thousands of hungry customers, live kitchen dispatch tracking, automated order printing, and dedicated merchant analytics.
            </p>
            <Link to="/register?role=restaurantOwner">
              <Button variant="primary" size="md">
                Register Your Restaurant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
