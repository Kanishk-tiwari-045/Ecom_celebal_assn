import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  Grid, 
  List, 
  Filter, 
  Search, 
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ChevronDown,
  X,
  ArrowUpDown
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
  
  const [searchParams] = useSearchParams();
  const { category } = useParams();
  const { addItem } = useCart();

  // Mock products data - replace with real API
  const mockProducts = [
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones',
      price: 299.99,
      salePrice: 199.99,
      rating: 4.8,
      reviews: 1247,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      category: 'Electronics',
      brand: 'AudioTech',
      isNew: true,
      slug: 'wireless-headphones',
      description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
      features: ['Active Noise Cancellation', '30h Battery', 'Wireless', 'Premium Sound']
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 399.99,
      salePrice: 299.99,
      rating: 4.6,
      reviews: 892,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      category: 'Electronics',
      brand: 'FitTech',
      isHot: true,
      slug: 'smart-fitness-watch',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
      features: ['Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking']
    },
    {
      id: 3,
      name: 'Premium Running Shoes',
      price: 159.99,
      rating: 4.7,
      reviews: 634,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      category: 'Sports',
      brand: 'RunPro',
      slug: 'premium-running-shoes',
      description: 'Lightweight running shoes with advanced cushioning technology.',
      features: ['Lightweight', 'Cushioned', 'Breathable', 'Durable']
    },
    {
      id: 4,
      name: 'Minimalist Backpack',
      price: 89.99,
      salePrice: 69.99,
      rating: 4.5,
      reviews: 423,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
      category: 'Fashion',
      brand: 'UrbanStyle',
      slug: 'minimalist-backpack',
      description: 'Sleek and functional backpack perfect for daily commute.',
      features: ['Water Resistant', 'Laptop Compartment', 'Ergonomic', 'Stylish']
    },
    {
      id: 5,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      salePrice: 19.99,
      rating: 4.3,
      reviews: 256,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      category: 'Fashion',
      brand: 'EcoWear',
      slug: 'organic-cotton-tshirt',
      description: 'Comfortable organic cotton t-shirt in various colors.',
      features: ['Organic Cotton', 'Soft Feel', 'Multiple Colors', 'Sustainable']
    },
    {
      id: 6,
      name: 'Smart Home Speaker',
      price: 149.99,
      rating: 4.4,
      reviews: 789,
      images: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400'],
      category: 'Electronics',
      brand: 'SmartHome',
      slug: 'smart-home-speaker',
      description: 'Voice-controlled smart speaker with premium sound quality.',
      features: ['Voice Control', 'Smart Home Hub', 'Premium Audio', 'Compact Design']
    }
  ];

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filtered = [...mockProducts];
      
      // Filter by category from URL
      if (category) {
        filtered = filtered.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Filter by search query from URL
      const searchFromUrl = searchParams.get('search');
      if (searchFromUrl) {
        setSearchQuery(searchFromUrl);
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchFromUrl.toLowerCase()) ||
          product.description.toLowerCase().includes(searchFromUrl.toLowerCase())
        );
      }
      
      setProducts(filtered);
      setFilteredProducts(filtered);
      setIsLoading(false);
    };

    loadProducts();
  }, [category, searchParams]);

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
        filtered.sort((a, b) => b.isNew - a.isNew);
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
          {/* Filters Sidebar */}
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
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => addItem(product)}
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

// Product Card Component
const ProductCard = ({ product, viewMode, onAddToCart, index }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex gap-6">
          <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.images[0]}
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
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isWishlisted
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-secondary-700/50 text-secondary-400 hover:text-white'
                  )}
                >
                  <Heart className="w-4 h-4" />
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
          src={product.images[0]}
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
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              isWishlisted
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 hover:bg-white text-secondary-600'
            )}
          >
            <Heart className="w-4 h-4" />
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
