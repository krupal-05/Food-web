import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  LogOut,
  User,
  Utensils,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import Button from '../common/Button.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isOwner, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-bold tracking-tight transition-all duration-200 py-1.5 px-3 rounded-lg ${
      isActive
        ? 'text-orange-600 bg-orange-50 font-extrabold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-950 font-['Outfit']">
                Food<span className="text-orange-500">X</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 -mt-1">
                Fast & Fresh
              </span>
            </div>
          </Link>

          {/* Center: Main Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" className={navLinkClasses} end>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClasses}>
              Menu
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>
          </nav>

          {/* Right: Actions / Auth / Cart */}
          <div className="hidden md:flex items-center gap-3">
            {/* Customer Cart (Displayed ONLY for logged-in Customers) */}
            {isAuthenticated && isCustomer && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black flex items-center justify-center shadow-sm animate-pulse">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </Link>
            )}

            {/* Authenticated User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.firstName || 'Account'}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {user?.role === 'restaurantOwner' ? 'Owner' : user?.role || 'User'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>

                      {/* Owner Dashboard Quick Link */}
                      {isOwner && (
                        <Link
                          to="/owner/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-orange-500" />
                          <span>Owner Dashboard</span>
                        </Link>
                      )}

                      {/* Admin Console Quick Link */}
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      {/* Customer Orders */}
                      {isCustomer && (
                        <Link
                          to="/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          <span>My Orders</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && isCustomer && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-700 hover:text-orange-600"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 flex flex-col gap-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              Menu
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              About Us
            </NavLink>

            {isAuthenticated && isCustomer && (
              <NavLink
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                My Orders
              </NavLink>
            )}

            {isAuthenticated && isOwner && (
              <NavLink
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-orange-600 py-1.5 px-3 rounded-lg bg-orange-50"
              >
                Owner Dashboard
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-purple-700 py-1.5 px-3 rounded-lg bg-purple-50"
              >
                Admin Console
              </NavLink>
            )}
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                    {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-slate-600 px-3 py-1.5 hover:bg-slate-50 rounded-lg"
                >
                  Profile & Address
                </Link>

                <Button onClick={handleLogout} variant="outline" size="sm" className="w-full text-rose-600">
                  <LogOut className="w-4 h-4 mr-1.5" /> Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
