import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, ...action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_CART':
      return { items: [], totalAmount: 0, totalItems: 0, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data } = await api.get('/cart');
      dispatch({ type: 'SET_CART', payload: data });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      dispatch({ type: 'SET_CART', payload: data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/update/${productId}`, { quantity });
      dispatch({ type: 'SET_CART', payload: data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update cart' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      dispatch({ type: 'SET_CART', payload: data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to clear cart' };
    }
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};