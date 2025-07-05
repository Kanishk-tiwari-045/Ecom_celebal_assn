import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Package, 
  ShoppingBag,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '../utils';

const NotFound = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimating(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularCategories = [
    { name: 'Electronics', href: '/products/electronics', icon: Zap },
    { name: 'Fashion', href: '/products/fashion', icon: Star },
    { name: 'Home & Garden', href: '/products/home-garden', icon: Package },
    { name: 'Sports', href: '/products/sports', icon: ShoppingBag }
  ];

  const quickLinks = [
    { name: 'Home', href: '/', description: 'Return to homepage' },
    { name: 'All Products', href: '/products', description: 'Browse our catalog' },
    { name: 'My Account', href: '/profile', description: 'Manage your account' },
    { name: 'Contact Us', href: '/contact', description: 'Get help from support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className={cn(
            'text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-4 transition-all duration-1000',
            isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}>
            404
          </div>
          
          {/* Floating Elements */}
          <div className="relative">
            <div className={cn(
              'absolute -top-16 left-1/4 w-8 h-8 bg-primary-500/20 rounded-full transition-all duration-1000 delay-300',
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )} />
            <div className={cn(
              'absolute -top-12 right-1/3 w-6 h-6 bg-accent-500/20 rounded-full transition-all duration-1000 delay-500',
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )} />
            <div className={cn(
              'absolute -top-20 right-1/4 w-4 h-4 bg-green-500/20 rounded-full transition-all duration-1000 delay-700',
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )} />
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          'transition-all duration-1000 delay-200',
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-secondary-300 mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry though, we'll help you find your way back to shopping paradise!
          </p>

          {/* Search Bar */}
          <div className="mb-12">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-4 bg-secondary-800/50 border border-secondary-700 rounded-xl text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary btn-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Link
              to="/"
              className="group bg-secondary-800/50 hover:bg-secondary-700/50 rounded-xl p-6 border border-secondary-700 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-lg mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors">
                <Home className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Go Home</h3>
              <p className="text-secondary-400 text-sm">Return to our homepage and start fresh</p>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="group bg-secondary-800/50 hover:bg-secondary-700/50 rounded-xl p-6 border border-secondary-700 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-lg mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors">
                <ArrowLeft className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Go Back</h3>
              <p className="text-secondary-400 text-sm">Return to the previous page</p>
            </button>
          </div>

          {/* Popular Categories */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCategories.map((category, index) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className={cn(
                    'group bg-secondary-800/50 hover:bg-secondary-700/50 rounded-lg p-4 border border-secondary-700 hover:border-primary-500/50 transition-all duration-300',
                    'animate-slide-up'
                  )}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-500/10 rounded-lg mx-auto mb-3 group-hover:bg-primary-500/20 transition-colors">
                    <category.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-white font-medium text-sm">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'group text-left bg-secondary-800/30 hover:bg-secondary-700/50 rounded-lg p-4 border border-secondary-700/50 hover:border-primary-500/50 transition-all duration-300',
                    'animate-slide-up'
                  )}
                  style={{ animationDelay: `${1000 + index * 100}ms` }}
                >
                  <h3 className="text-white font-medium mb-1 group-hover:text-primary-400 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-secondary-400 text-sm">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Message */}
          <div className={cn(
            'bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-xl p-6 border border-primary-500/20 transition-all duration-1000 delay-1200',
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <p className="text-primary-200 text-sm">
              💡 <strong>Pro Tip:</strong> While you're here, why not check out our latest deals? 
              We've got some amazing products waiting for you!
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-8 w-2 h-2 bg-primary-400/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-accent-400/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-16 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-1/3 right-8 w-2.5 h-2.5 bg-blue-400/30 rounded-full animate-pulse delay-500" />
      </div>
    </div>
  );
};

export default NotFound;
