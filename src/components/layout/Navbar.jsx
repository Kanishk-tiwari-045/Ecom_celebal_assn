import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Package,
  LogOut,
  Settings,
  Bell,
  Plus,
  Minus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn, debounce, formatPrice } from '../../utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const { 
    items, 
    itemCount, 
    isOpen: isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem,
    total,
    subtotal
  } = useCart();
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Mock search function (replace with real API call)
  const performSearch = debounce((query) => {
    if (query.length > 2) {
      // Mock search results
      const mockResults = [
        { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99 },
        { id: 2, name: 'Smart Watch', category: 'Electronics', price: 299.99 },
        { id: 3, name: 'Running Shoes', category: 'Sports', price: 129.99 },
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/products', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const categories = [
    { name: 'Electronics', href: '/products/electronics' },
    { name: 'Fashion', href: '/products/fashion' },
    { name: 'Home & Garden', href: '/products/home-garden' },
    { name: 'Sports', href: '/products/sports' },
    { name: 'Books', href: '/products/books' }
  ];

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-secondary-900/95 backdrop-blur-md border-b border-secondary-700/50 shadow-lg' 
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      location.pathname === item.href
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-secondary-300 hover:text-white hover:bg-secondary-800/50'
                    )}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Categories Dropdown */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-secondary-800/95 backdrop-blur-md border border-secondary-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            className="block px-4 py-2 text-sm text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-colors"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search, Cart, User Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all duration-200"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-secondary-800/95 backdrop-blur-md border border-secondary-700 rounded-xl shadow-xl animate-slide-up">
                    <form onSubmit={handleSearchSubmit} className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                          autoFocus
                        />
                      </div>
                    </form>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="border-t border-secondary-700 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={`/product/${result.id}`}
                            className="block px-4 py-3 hover:bg-secondary-700/50 transition-colors"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white text-sm font-medium">{result.name}</p>
                                <p className="text-secondary-400 text-xs">{result.category}</p>
                              </div>
                              <span className="text-primary-400 font-medium">${result.price}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all duration-200"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all duration-200 group"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-secondary-800/95 backdrop-blur-md border border-secondary-700 rounded-xl shadow-xl animate-slide-up">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        <span>Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Wishlist</span>
                      </Link>
                      <div className="border-t border-secondary-700 my-1" />
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-secondary-300 hover:text-white hover:bg-secondary-700/50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-secondary-900/95 backdrop-blur-md border-t border-secondary-700/50">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                    location.pathname === item.href
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-secondary-300 hover:text-white hover:bg-secondary-800/50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={toggleCart} 
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-secondary-900 shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-primary-400" />
                  Shopping Cart ({itemCount})
                </h2>
                <button
                  onClick={toggleCart}
                  className="p-2 text-secondary-400 hover:text-white hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-24 h-24 bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-12 h-12 text-secondary-600" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Your cart is empty</h3>
                    <p className="text-secondary-400 text-sm mb-6">Add some products to get started!</p>
                    <Link
                      to="/products"
                      onClick={toggleCart}
                      className="btn btn-primary btn-md"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <div key={item.cartId} className="flex items-center space-x-4 bg-secondary-800/50 rounded-lg p-4 hover:bg-secondary-800/70 transition-colors">
                        <Link to={`/product/${item.slug}`} onClick={toggleCart}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.slug}`} 
                            onClick={toggleCart}
                            className="block"
                          >
                            <h3 className="text-white font-medium text-sm hover:text-primary-400 transition-colors truncate">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-primary-400 font-semibold text-sm">{formatPrice(item.price)}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-sm w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.cartId)}
                          className="p-2 text-secondary-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-secondary-700 p-6 space-y-4 bg-secondary-800/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-secondary-300">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link
                      to="/cart"
                      onClick={toggleCart}
                      className="w-full btn btn-secondary btn-md"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={toggleCart}
                      className="w-full btn btn-primary btn-md group"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  <p className="text-secondary-500 text-xs text-center">
                    Free shipping on orders over $50
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
