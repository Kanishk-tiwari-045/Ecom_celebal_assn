import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  SET_LOADING: 'SET_LOADING',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON'
};

// Initial cart state
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
  shipping: 0
};

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
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

      const newState = calculateTotals({ ...state, items: newItems });
      return newState;
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
      return { 
        ...initialState, 
        isOpen: state.isOpen 
      };
    }

    case CART_ACTIONS.TOGGLE_CART: {
      return { 
        ...state, 
        isOpen: !state.isOpen 
      };
    }

    case CART_ACTIONS.SET_LOADING: {
      return { 
        ...state, 
        isLoading: action.payload 
      };
    }

    case CART_ACTIONS.APPLY_COUPON: {
      const coupon = action.payload;
      const discount = calculateDiscount(state.subtotal, coupon);
      return calculateTotals({ 
        ...state, 
        coupon, 
        discount 
      });
    }

    case CART_ACTIONS.REMOVE_COUPON: {
      return calculateTotals({ 
        ...state, 
        coupon: null, 
        discount: 0 
      });
    }

    default:
      return state;
  }
}

// Calculate cart totals
function calculateTotals(state) {
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping - state.discount;

  return {
    ...state,
    subtotal,
    itemCount,
    tax,
    shipping,
    total: Math.max(0, total)
  };
}

// Calculate coupon discount
function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0;
  
  if (coupon.type === 'percentage') {
    return (subtotal * coupon.value) / 100;
  } else if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal);
  }
  
  return 0;
}

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = storage.get('cart');
    if (savedCart && savedCart.items) {
      savedCart.items.forEach(item => {
        dispatch({
          type: CART_ACTIONS.ADD_ITEM,
          payload: item
        });
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      storage.set('cart', {
        items: state.items,
        coupon: state.coupon
      });
    } else {
      storage.remove('cart');
    }
  }, [state.items, state.coupon]);

  // Cart actions
  const addItem = (product, quantity = 1, selectedOptions = {}) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        originalPrice: product.price,
        image: product.images[0],
        category: product.category,
        brand: product.brand,
        quantity,
        selectedOptions,
        slug: product.slug
      }
    });

    // Show success animation
    setTimeout(() => {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
    }, 300);
  };

  const removeItem = (cartId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: cartId
    });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { cartId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART });
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
      dispatch({
        type: CART_ACTIONS.APPLY_COUPON,
        payload: coupon
      });
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
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
