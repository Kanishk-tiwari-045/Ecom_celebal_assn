import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Grid, List, Filter, Search, SlidersHorizontal, Star, Heart, ShoppingCart, Eye, ChevronDown, X, ArrowUpDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice, calculateDiscount, debounce } from '../utils';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const { addItem } = useCart();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch products from backend API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let url = '/api/products';
        const params = [];
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) params.push(`search=${encodeURIComponent(searchFromUrl)}`);
        if (params.length) url += `?${params.join('&')}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        setSearchQuery(searchFromUrl || '');
      } catch (err) {
        setProducts([]);
        setFilteredProducts([]);
      }
      setIsLoading(false);
    };

    loadProducts();
    // eslint-disable-next-line
  }, [category, searchParams]);

  // Fetch user wishlist on mount (if logged in)
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !token) {
        setWishlist([]);
        return;
      }
      try {
        const res = await fetch('/api/user/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist.map(p => p._id || p.id));
        } else {
          setWishlist([]);
        }
      } catch {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user, token]);

  // Get unique values for filters
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.category))], [products]
  );
  
  const brands = useMemo(() => 
    [...new Set(products.map(p => p.brand))], [products]
  );

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(product => product.rating >= selectedRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, selectedRating, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setSearchQuery('');
  };

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  // Wishlist toggle handler
  const handleWishlistToggle = async (productId) => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      const isInWishlist = wishlist.includes(productId);
      const res = await fetch('/api/user/wishlist', {
        method: isInWishlist ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist.map(p => p._id || p.id));
      }
    } catch {
      // Optionally show error
    }
    setWishlistLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <div className="w-64 space-y-6">
              <SkeletonLoader variant="text" lines={8} />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} variant="card" />
                ))}
              </div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {category ? `${category} Products` : 'All Products'}
          </h1>
          <p className="text-secondary-400">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={searchQuery}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>

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

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-secondary-800/50 border border-secondary-700 rounded-lg px-4 py-3 pr-10 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn btn-secondary btn-md flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - EXACTLY THE SAME AS YOUR ORIGINAL */}
          <div className={cn(
            'w-64 space-y-6',
            'lg:block',
            showFilters ? 'block' : 'hidden'
          )}>
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="rounded border-secondary-600 bg-secondary-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                      />
                      <span className="text-secondary-300 text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium text-white mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="rounded border-secondary-600 bg-secondary-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                      />
                      <span className="text-secondary-300 text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-white mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-sm text-secondary-400">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-white mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="border-secondary-600 bg-secondary-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-4 h-4',
                              i < rating ? 'text-yellow-400 fill-current' : 'text-secondary-600'
                            )}
                          />
                        ))}
                        <span className="text-secondary-300 text-sm ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-secondary-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-secondary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-secondary-400 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary btn-md"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              )}>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => addItem(product)}
                    onToggleWishlist={() => handleWishlistToggle(product._id || product.id)}
                    isWishlisted={wishlist.includes(product._id || product.id)}
                    wishlistLoading={wishlistLoading}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component - Updated with wishlist functionality
const ProductCard = ({ product, viewMode, onAddToCart, onToggleWishlist, isWishlisted, wishlistLoading, index }) => {
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex gap-6">
          <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-primary-400 text-sm font-medium">{product.brand}</span>
                <h3 className="text-white font-semibold text-lg">{product.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {product.salePrice ? (
                  <>
                    <span className="text-xl font-bold text-primary-400">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-secondary-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-secondary-300 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-secondary-300 text-sm">{product.rating}</span>
                  <span className="text-secondary-500 text-sm">({product.reviews})</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={onToggleWishlist}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isWishlisted
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-secondary-700/50 text-secondary-400 hover:text-white'
                  )}
                  disabled={wishlistLoading}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button className="p-2 bg-secondary-700/50 text-secondary-400 hover:text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={onAddToCart}
                  className="btn btn-primary btn-sm"
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
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isNew && (
            <span className="badge bg-green-500 text-white">New</span>
          )}
          {product.isHot && (
            <span className="badge bg-red-500 text-white">Hot</span>
          )}
          {product.salePrice && (
            <span className="badge bg-primary-500 text-white">
              -{calculateDiscount(product.price, product.salePrice)}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onToggleWishlist}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              isWishlisted
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 hover:bg-white text-secondary-600'
            )}
            disabled={wishlistLoading}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
            <Eye className="w-4 h-4 text-secondary-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary-400 text-sm font-medium">{product.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-secondary-300 text-sm">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary-400">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-secondary-400 line-through text-sm">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-white">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-secondary-400 text-xs">
            {product.reviews} reviews
          </span>
        </div>

        <button
          onClick={onAddToCart}
          className="w-full btn btn-primary btn-sm group"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default Products;
