import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Share2,
  Grid,
  List,
  Star,
  Filter,
  Search,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice, calculateDiscount, storage } from '../utils';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { addItem } = useCart();

  // Mock wishlist data - replace with real API
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load from localStorage or use mock data
      const savedWishlist = storage.get('wishlist', []);
      
      const mockWishlistItems = [
        {
          id: 1,
          name: 'Wireless Noise-Cancelling Headphones',
          price: 299.99,
          salePrice: 199.99,
          rating: 4.8,
          reviews: 1247,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          category: 'Electronics',
          brand: 'AudioTech',
          isNew: true,
          slug: 'wireless-headphones',
          addedDate: '2024-01-20',
          inStock: true,
          stockCount: 15
        },
        {
          id: 2,
          name: 'Smart Fitness Watch',
          price: 399.99,
          salePrice: 299.99,
          rating: 4.6,
          reviews: 892,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          category: 'Electronics',
          brand: 'FitTech',
          isHot: true,
          slug: 'smart-fitness-watch',
          addedDate: '2024-01-18',
          inStock: true,
          stockCount: 8
        },
        {
          id: 3,
          name: 'Premium Running Shoes',
          price: 159.99,
          rating: 4.7,
          reviews: 634,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          category: 'Sports',
          brand: 'RunPro',
          slug: 'premium-running-shoes',
          addedDate: '2024-01-15',
          inStock: false,
          stockCount: 0
        },
        {
          id: 4,
          name: 'Minimalist Backpack',
          price: 89.99,
          salePrice: 69.99,
          rating: 4.5,
          reviews: 423,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
          category: 'Fashion',
          brand: 'UrbanStyle',
          slug: 'minimalist-backpack',
          addedDate: '2024-01-12',
          inStock: true,
          stockCount: 25
        },
        {
          id: 5,
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          salePrice: 19.99,
          rating: 4.3,
          reviews: 256,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          category: 'Fashion',
          brand: 'EcoWear',
          slug: 'organic-cotton-tshirt',
          addedDate: '2024-01-10',
          inStock: true,
          stockCount: 50
        }
      ];

      setWishlistItems(savedWishlist.length > 0 ? savedWishlist : mockWishlistItems);
      setIsLoading(false);
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlistItems.length > 0) {
      storage.set('wishlist', wishlistItems);
    }
  }, [wishlistItems]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (item) => {
    addItem(item);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    storage.remove('wishlist');
  };

  const moveAllToCart = () => {
    wishlistItems.forEach(item => {
      if (item.inStock) {
        addItem(item);
      }
    });
  };

  // Get unique categories
  const categories = [...new Set(wishlistItems.map(item => item.category))];

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter(item => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedDate) - new Date(a.addedDate);
        case 'oldest':
          return new Date(a.addedDate) - new Date(b.addedDate);
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <SkeletonLoader variant="text" lines={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} variant="card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Wishlist
              </h1>
              <p className="text-secondary-400">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={moveAllToCart}
                  className="btn btn-primary btn-md"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </button>
                <button
                  onClick={clearWishlist}
                  className="btn btn-ghost btn-md text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-secondary-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-secondary-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
            <p className="text-secondary-400 mb-6 max-w-md mx-auto">
              Save items you love to your wishlist and come back to them later.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <Package className="w-5 h-5 mr-2" />
              Discover Products
            </Link>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wishlist..."
                  className="w-full pl-10 pr-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-secondary-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-400 hover:text-white'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'text-secondary-400 hover:text-white'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-secondary-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No items found</h3>
                <p className="text-secondary-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              )}>
                {filteredItems.map((item, index) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onRemove={() => removeFromWishlist(item.id)}
                    onAddToCart={() => addToCart(item)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Wishlist Item Component
const WishlistItem = ({ item, viewMode, onRemove, onAddToCart, index }) => {
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex gap-6">
          <Link to={`/product/${item.slug}`} className="block w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-primary-400 text-sm font-medium">{item.brand}</span>
                <Link 
                  to={`/product/${item.slug}`}
                  className="block text-white font-semibold text-lg hover:text-primary-400 transition-colors"
                >
                  {item.name}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-secondary-300 text-sm">{item.rating}</span>
                  </div>
                  <span className="text-secondary-500 text-sm">({item.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="text-right">
                {item.salePrice ? (
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-primary-400">
                      {formatPrice(item.salePrice)}
                    </span>
                    <span className="text-secondary-400 line-through text-sm">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-white">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                {!item.inStock ? (
                  <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                ) : (
                  <span className="text-green-400 text-sm">In Stock ({item.stockCount})</span>
                )}
                {item.salePrice && (
                  <span className="badge bg-primary-500 text-white text-xs">
                    -{calculateDiscount(item.price, item.salePrice)}% OFF
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/product/${item.slug}`}
                  className="p-2 bg-secondary-700/50 text-secondary-400 hover:text-white rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button className="p-2 bg-secondary-700/50 text-secondary-400 hover:text-white rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onRemove}
                  className="p-2 bg-secondary-700/50 text-secondary-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onAddToCart}
                  disabled={!item.inStock}
                  className="btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-secondary-800/50 rounded-2xl overflow-hidden hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${item.slug}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {item.isNew && (
            <span className="badge bg-green-500 text-white">New</span>
          )}
          {item.isHot && (
            <span className="badge bg-red-500 text-white">Hot</span>
          )}
          {item.salePrice && (
            <span className="badge bg-primary-500 text-white">
              -{calculateDiscount(item.price, item.salePrice)}% OFF
            </span>
          )}
          {!item.inStock && (
            <span className="badge bg-red-600 text-white">Out of Stock</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/product/${item.slug}`}
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
          >
            <Eye className="w-4 h-4 text-secondary-600" />
          </Link>
          <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
            <Share2 className="w-4 h-4 text-secondary-600" />
          </button>
          <button
            onClick={onRemove}
            className="w-8 h-8 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary-400 text-sm font-medium">{item.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-secondary-300 text-sm">{item.rating}</span>
          </div>
        </div>
        
        <Link 
          to={`/product/${item.slug}`}
          className="block text-white font-semibold mb-2 line-clamp-2 hover:text-primary-400 transition-colors"
        >
          {item.name}
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {item.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary-400">
                  {formatPrice(item.salePrice)}
                </span>
                <span className="text-secondary-400 line-through text-sm">
                  {formatPrice(item.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-white">
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          <span className="text-secondary-400 text-xs">
            {item.reviews} reviews
          </span>
        </div>

        <button
          onClick={onAddToCart}
          disabled={!item.inStock}
          className="w-full btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
