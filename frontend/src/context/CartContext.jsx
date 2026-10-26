import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart.service.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error: toastError } = useToast();

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync cart from backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart({ items: [], totalAmount: 0, totalCount: 0 });
      return;
    }

    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      if (data) {
        setCart({
          items: data.items || [],
          totalAmount: data.totalAmount || 0,
          totalCount: data.totalCount || 0,
          _id: data._id,
        });
      }
    } catch (err) {
      console.warn('Error fetching cart from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add Item to cart
  const addToCart = async (foodId, quantity = 1, foodName = 'Item') => {
    if (!isAuthenticated) {
      toastError('Please log in to add items to your cart');
      return false;
    }

    if (!isCustomer) {
      toastError('Only customer accounts can place orders in cart');
      return false;
    }

    try {
      setIsUpdating(true);
      const updatedCart = await cartService.addToCart(foodId, quantity);
      setCart(updatedCart);
      success(`${foodName} added to cart!`);
      return true;
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to add item to cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Item Quantity
  const updateQuantity = async (foodId, newQuantity) => {
    try {
      setIsUpdating(true);
      const updatedCart = await cartService.updateQuantity(foodId, newQuantity);
      setCart(updatedCart);
      return true;
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to update quantity');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove single Item
  const removeItem = async (foodId, foodName = 'Item') => {
    try {
      setIsUpdating(true);
      const updatedCart = await cartService.removeItem(foodId);
      setCart(updatedCart);
      success(`${foodName} removed from cart`);
      return true;
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to remove item');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setIsUpdating(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart || { items: [], totalAmount: 0, totalCount: 0 });
      return true;
    } catch (err) {
      toastError(err.extractedMessage || 'Failed to clear cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper: check if a food item is in cart
  const getItemQuantity = (foodId) => {
    const item = cart.items.find(
      (ci) => ci.foodId === foodId || ci.foodId?._id === foodId || ci.food?._id === foodId
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    items: cart.items,
    totalAmount: cart.totalAmount,
    totalCount: cart.totalCount,
    isLoading,
    isUpdating,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
