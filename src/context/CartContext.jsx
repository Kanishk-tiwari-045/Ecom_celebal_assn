import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  SET_LOADING: 'SET_LOADING',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON',
  SAVE_FOR_PAYMENT: 'SAVE_FOR_PAYMENT',
  RESTORE_FROM_PAYMENT: 'RESTORE_FROM_PAYMENT',
  CLEAR_AFTER_PAYMENT: 'CLEAR_AFTER_PAYMENT'
};

const initialState = {
  items: [],
  isOpen: false,
  isLoading: false,
  total: 0,
  itemCount: 0,
  coupon: null,
  discount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  isPaymentInProgress: false
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_CART: {
      return calculateTotals({ ...state, items: action.payload });
    }
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.payload.selectedOptions)
      );
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(action.payload.selectedOptions)
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, { 
          ...action.payload, 
          cartId: `${action.payload.id}-${Date.now()}`,
          addedAt: new Date().toISOString()
        }];
      }
      return calculateTotals({ ...state, items: newItems });
    }
    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.cartId !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals({ ...state, items: newItems });
    }
    case CART_ACTIONS.CLEAR_CART: {
      return { ...initialState, isOpen: state.isOpen };
    }
    case CART_ACTIONS.TOGGLE_CART: {
      return { ...state, isOpen: !state.isOpen };
    }
    case CART_ACTIONS.SET_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case CART_ACTIONS.APPLY_COUPON: {
      const coupon = action.payload;
      const discount = calculateDiscount(state.subtotal, coupon);
      return calculateTotals({ ...state, coupon, discount });
    }
    case CART_ACTIONS.REMOVE_COUPON: {
      return calculateTotals({ ...state, coupon: null, discount: 0 });
    }
    case CART_ACTIONS.SAVE_FOR_PAYMENT: {
      // Save current cart state to localStorage before payment
      const cartData = {
        items: state.items,
        coupon: state.coupon,
        discount: state.discount,
        subtotal: state.subtotal,
        tax: state.tax,
        shipping: state.shipping,
        total: state.total,
        itemCount: state.itemCount
      };
      storage.set('cartBeforePayment', cartData);
      return { ...state, isPaymentInProgress: true };
    }
    case CART_ACTIONS.RESTORE_FROM_PAYMENT: {
      // Restore cart from localStorage after payment failure
      const savedCart = storage.get('cartBeforePayment');
      if (savedCart) {
        return {
          ...state,
          items: savedCart.items || [],
          coupon: savedCart.coupon || null,
          discount: savedCart.discount || 0,
          subtotal: savedCart.subtotal || 0,
          tax: savedCart.tax || 0,
          shipping: savedCart.shipping || 0,
          total: savedCart.total || 0,
          itemCount: savedCart.itemCount || 0,
          isPaymentInProgress: false
        };
      }
      return { ...state, isPaymentInProgress: false };
    }
    case CART_ACTIONS.CLEAR_AFTER_PAYMENT: {
      // Clear cart and remove saved payment data after successful payment
      storage.remove('cartBeforePayment');
      return { ...initialState, isOpen: state.isOpen };
    }
    default:
      return state;
  }
}

function calculateTotals(state) {
  const subtotal = state.items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
  
  const itemCount = state.items.reduce((sum, item) => {
    const quantity = parseInt(item.quantity) || 0;
    return sum + quantity;
  }, 0);
  
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const discount = parseFloat(state.discount) || 0;
  const total = subtotal + tax + shipping - discount;
  
  return { 
    ...state, 
    subtotal: parseFloat(subtotal.toFixed(2)), 
    itemCount, 
    tax: parseFloat(tax.toFixed(2)), 
    shipping: parseFloat(shipping.toFixed(2)), 
    total: parseFloat(Math.max(0, total).toFixed(2))
  };
}

function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0;
  const sub = parseFloat(subtotal) || 0;
  if (coupon.type === 'percentage') {
    return parseFloat(((sub * coupon.value) / 100).toFixed(2));
  } else if (coupon.type === 'fixed') {
    return parseFloat(Math.min(coupon.value, sub).toFixed(2));
  }
  return 0;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, token } = useContext(AuthContext);

  // Load cart from backend or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      if (user && token) {
        try {
          const res = await fetch('/api/user/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.cart) {
            dispatch({ type: CART_ACTIONS.SET_CART, payload: data.cart });
          }
        } catch {
          dispatch({ type: CART_ACTIONS.SET_CART, payload: [] });
        }
      } else {
        const savedCart = storage.get('cart');
        if (savedCart && savedCart.items) {
          dispatch({ type: CART_ACTIONS.SET_CART, payload: savedCart.items });
        }
      }
    };
    loadCart();
    // eslint-disable-next-line
  }, [user, token]);

  // Save cart to localStorage if not logged in
  useEffect(() => {
    if (!user && !state.isPaymentInProgress) {
      if (state.items.length > 0) {
        storage.set('cart', { items: state.items, coupon: state.coupon });
      } else {
        storage.remove('cart');
      }
    }
  }, [state.items, state.coupon, user, state.isPaymentInProgress]);

  // Backend cart actions
  const syncCartWithBackend = async (method, body) => {
    if (!user || !token) return;
    try {
      await fetch('/api/user/cart', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  };

  const addItem = (product, quantity = 1, selectedOptions = {}) => {
    const price = parseFloat(product.salePrice || product.price) || 0;
    const originalPrice = parseFloat(product.price) || 0;
    const qty = parseInt(quantity) || 1;

    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: {
        id: product._id || product.id,
        name: product.name || 'Unknown Product',
        price,
        originalPrice,
        image: product.images?.[0] || product.image || '/placeholder.jpg',
        category: product.category || 'Uncategorized',
        brand: product.brand || 'Unknown Brand',
        quantity: qty,
        selectedOptions,
        slug: product.slug || product._id || product.id
      }
    });
    
    if (user && token) {
      syncCartWithBackend('POST', {
        productId: product._id || product.id,
        quantity: qty,
        selectedOptions
      });
    }
    
    setTimeout(() => {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
    }, 300);
  };

  const removeItem = (cartId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: cartId });
    if (user && token) {
      syncCartWithBackend('DELETE', { cartId });
    }
  };

  const updateQuantity = (cartId, quantity) => {
    const qty = parseInt(quantity) || 0;
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { cartId, quantity: qty } });
    if (user && token) {
      syncCartWithBackend('PUT', { cartId, quantity: qty });
    }
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    if (user && token) {
      syncCartWithBackend('DELETE');
    }
  };

  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
  };

  // Payment-related functions
  const saveCartForPayment = () => {
    dispatch({ type: CART_ACTIONS.SAVE_FOR_PAYMENT });
  };

  const restoreCartAfterPayment = () => {
    dispatch({ type: CART_ACTIONS.RESTORE_FROM_PAYMENT });
  };

  const clearCartAfterPayment = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_AFTER_PAYMENT });
    if (user && token) {
      syncCartWithBackend('DELETE');
    }
  };

  const applyCoupon = (couponCode) => {
    // Mock coupon validation
    const validCoupons = {
      'SAVE10': { code: 'SAVE10', type: 'percentage', value: 10, description: '10% off' },
      'WELCOME20': { code: 'WELCOME20', type: 'percentage', value: 20, description: '20% off' },
      'FLAT5': { code: 'FLAT5', type: 'fixed', value: 5, description: '$5 off' }
    };
    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      dispatch({ type: CART_ACTIONS.APPLY_COUPON, payload: coupon });
      return { success: true, message: `Coupon "${coupon.code}" applied successfully!` };
    } else {
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
  };

  const getItemInCart = (productId, selectedOptions = {}) => {
    return state.items.find(item => 
      item.id === productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );
  };

  const isInCart = (productId, selectedOptions = {}) => {
    return !!getItemInCart(productId, selectedOptions);
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    applyCoupon,
    removeCoupon,
    getItemInCart,
    isInCart,
    saveCartForPayment,
    restoreCartAfterPayment,
    clearCartAfterPayment
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
