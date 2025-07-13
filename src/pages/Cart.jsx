import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight, Tag, Gift, Truck, Shield, X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Cart = () => {
  const {
    items,
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
    discount,
    coupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(cartId);
    } else {
      updateQuantity(cartId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    const result = await applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponCode('');
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-secondary-700/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="w-16 h-16 text-secondary-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-secondary-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link 
              to="/products"
              className="btn btn-primary btn-lg group"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-secondary-400">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link 
            to="/products"
            className="btn btn-ghost btn-md group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.cartId}
                className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-lg truncate">
                          {item.name}
                        </h3>
                        <p className="text-primary-400 text-sm">{item.brand}</p>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(item.selectedOptions).map(([key, value]) => (
                              <span 
                                key={key}
                                className="text-xs bg-secondary-700 text-secondary-300 px-2 py-1 rounded"
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="p-2 text-secondary-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-white">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-secondary-400 line-through text-sm">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-3 text-right">
                      <span className="text-primary-400 font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={clearCart}
                className="btn btn-ghost btn-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-primary-400" />
                Promo Code
              </h3>
              
              {coupon ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div>
                    <span className="text-green-400 font-medium">{coupon.code}</span>
                    <p className="text-green-300 text-sm">{coupon.description}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="btn btn-primary btn-sm"
                    >
                      {isApplyingCoupon ? (
                        <LoadingSpinner size="xs" color="white" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-400 text-sm">{couponError}</p>
                  )}
                  <div className="text-xs text-secondary-400">
                    Try: SAVE10, WELCOME20, or FLAT5
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-secondary-300">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-secondary-300">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="flex justify-between text-secondary-300">
                  <span className="flex items-center">
                    Shipping
                    {shipping === 0 && (
                      <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                
                <div className="border-t border-secondary-700 pt-3">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link 
                to="/checkout"
                className="w-full btn btn-primary btn-lg mt-6 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Security Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-secondary-400 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-400 text-sm">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-400 text-sm">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
