import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('food_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync state to localStorage
  const saveUserSession = (userData, accessToken = null, refreshToken = null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('food_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('food_user');
    }

    if (accessToken) {
      localStorage.setItem('food_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('food_refresh_token', refreshToken);
    }
  };

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem('food_user');
    localStorage.removeItem('food_access_token');
    localStorage.removeItem('food_refresh_token');
  }, []);

  // Fetch current user on mount to verify session validity
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('food_access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('food_user', JSON.stringify(currentUser));
      } else {
        clearSession();
      }
    } catch (err) {
      // If profile fetch fails with 401, session cleared by interceptor
      if (err.response?.status === 401) {
        clearSession();
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadUser();

    // Global unauthorized event handler
    const handleUnauthorized = () => {
      clearSession();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [loadUser, clearSession]);

  // Login handler
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user: loggedInUser, accessToken, reFreshToken } = res;
    saveUserSession(loggedInUser, accessToken, reFreshToken);
    return loggedInUser;
  };

  // Register handler
  const register = async (userData) => {
    const res = await authService.register(userData);
    const { user: registeredUser, accessToken, reFreshToken } = res;
    saveUserSession(registeredUser, accessToken, reFreshToken);
    return registeredUser;
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Backend logout cleanup warning:', err);
    } finally {
      clearSession();
    }
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    saveUserSession(updated);
    return updated;
  };

  // Normalized role checks
  const role = user?.role?.toLowerCase() || '';
  const isCustomer = role === 'customer';
  const isOwner = role === 'restaurantowner' || role === 'owner';
  const isAdmin = role === 'admin';
  const isAuthenticated = Boolean(user && user._id);

  const value = {
    user,
    role: user?.role || '',
    isAuthenticated,
    isLoading,
    isCustomer,
    isOwner,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
