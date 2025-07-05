import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice, calculateDiscount } from '../utils';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, isInCart, getItemInCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Mock product data - replace with real API
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock product data
      const mockProduct = {
        id: 1,
        name: 'Wireless Noise-Cancelling Headphones',
        price: 299.99,
        salePrice: 199.99,
        rating: 4.8,
        reviews: 1247,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
          'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'
        ],
        category: 'Electronics',
        brand: 'AudioTech',
        isNew: true,
        slug: 'wireless-headphones',
        description: 'Experience premium sound quality with our advanced wireless noise-cancelling headphones. Featuring cutting-edge technology and superior comfort for all-day listening.',
        features: [
          'Active Noise Cancellation with advanced algorithms',
          '30-hour battery life with quick charge',
          'Premium wireless connectivity with aptX HD',
          'Comfortable over-ear design with memory foam',
          'Built-in voice assistant support',
          'Foldable design for easy portability'
        ],
        specifications: {
          'Driver Size': '40mm',
          'Frequency Response': '20Hz - 20kHz',
          'Impedance': '32 Ohm',
          'Battery Life': '30 hours',
          'Charging Time': '2 hours',
          'Weight': '250g',
          'Connectivity': 'Bluetooth 5.0, 3.5mm jack',
          'Warranty': '2 years'
        },
        options: {
          color: {
            label: 'Color',
            choices: [
              { value: 'black', label: 'Midnight Black', color: '#000000' },
              { value: 'white', label: 'Pearl White', color: '#FFFFFF' },
              { value: 'blue', label: 'Ocean Blue', color: '#1E40AF' }
            ]
          },
          size: {
            label: 'Size',
            choices: [
              { value: 'regular', label: 'Regular' },
              { value: 'large', label: 'Large' }
            ]
          }
        },
        inStock: true,
        stockCount: 15
      };

      setProduct(mockProduct);
      
      // Set default options
      const defaultOptions = {};
      Object.entries(mockProduct.options).forEach(([key, option]) => {
        defaultOptions[key] = option.choices[0].value;
      });
      setSelectedOptions(defaultOptions);

      // Mock reviews
      setReviews([
        {
          id: 1,
          user: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50',
          rating: 5,
          date: '2024-01-15',
          title: 'Excellent sound quality!',
          comment: 'These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is amazing.',
          helpful: 24,
          verified: true
        },
        {
          id: 2,
          user: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
          rating: 4,
          date: '2024-01-10',
          title: 'Great value for money',
          comment: 'Solid build quality and great features. The only minor issue is they can get a bit warm during long sessions.',
          helpful: 18,
          verified: true
        },
        {
          id: 3,
          user: 'Emily Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
          rating: 5,
          date: '2024-01-08',
          title: 'Perfect for work from home',
          comment: 'The noise cancellation helps me focus during calls. Comfortable to wear all day.',
          helpful: 12,
          verified: false
        }
      ]);

      // Mock related products
      setRelatedProducts([
        {
          id: 2,
          name: 'Wireless Earbuds Pro',
          price: 149.99,
          salePrice: 119.99,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
          slug: 'wireless-earbuds-pro'
        },
        {
          id: 3,
          name: 'Gaming Headset RGB',
          price: 89.99,
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=300',
          slug: 'gaming-headset-rgb'
        },
        {
          id: 4,
          name: 'Bluetooth Speaker',
          price: 79.99,
          salePrice: 59.99,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
          slug: 'bluetooth-speaker'
        }
      ]);

      setIsLoading(false);
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedOptions);
    }
  };

  const handleOptionChange = (optionKey, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionKey]: value
    }));
  };

  const handleImageNavigation = (direction) => {
    if (!product) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImage((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const cartItem = product ? getItemInCart(product.id, selectedOptions) : null;
  const isInCartWithOptions = !!cartItem;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <SkeletonLoader className="w-full h-96" />
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <SkeletonLoader key={i} className="w-20 h-20" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <SkeletonLoader variant="text" lines={8} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <p className="text-secondary-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-secondary-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-secondary-600">/</span>
            <Link to="/products" className="text-secondary-400 hover:text-white transition-colors">
              Products
            </Link>
            <span className="text-secondary-600">/</span>
            <Link 
              to={`/products/${product.category.toLowerCase()}`} 
              className="text-secondary-400 hover:text-white transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-secondary-600">/</span>
            <span className="text-white">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square bg-secondary-800/50 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isNew && (
                    <span className="badge bg-green-500 text-white">New</span>
                  )}
                  {product.salePrice && (
                    <span className="badge bg-primary-500 text-white">
                      -{calculateDiscount(product.price, product.salePrice)}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-secondary-700 hover:border-secondary-600'
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary-400 font-medium">{product.brand}</span>
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
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-secondary-700/50 text-secondary-400 hover:text-white rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-600'
                      )}
                    />
                  ))}
                  <span className="text-white font-medium ml-2">{product.rating}</span>
                </div>
                <span className="text-secondary-400">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary-400">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xl text-secondary-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-green-400 font-medium">
                      Save {formatPrice(product.price - product.salePrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            {Object.entries(product.options).map(([key, option]) => (
              <div key={key}>
                <h3 className="text-white font-medium mb-3">{option.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.choices.map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => handleOptionChange(key, choice.value)}
                      className={cn(
                        'px-4 py-2 rounded-lg border transition-all duration-200',
                        selectedOptions[key] === choice.value
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-secondary-600 bg-secondary-700/30 text-secondary-300 hover:border-secondary-500'
                      )}
                    >
                      {key === 'color' && choice.color && (
                        <div
                          className="w-4 h-4 rounded-full mr-2 inline-block border border-secondary-600"
                          style={{ backgroundColor: choice.color }}
                        />
                      )}
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-secondary-700 hover:bg-secondary-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-secondary-400 text-sm">
                  {product.stockCount} in stock
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn btn-primary btn-lg group"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  <span>
                    {isInCartWithOptions ? 'Update Cart' : 'Add to Cart'}
                  </span>
                </button>
                <Link
                  to="/checkout"
                  className="btn btn-accent btn-lg"
                  onClick={handleAddToCart}
                >
                  Buy Now
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Truck, text: 'Free shipping over $50' },
                  { icon: Shield, text: '2-year warranty' },
                  { icon: RotateCcw, text: '30-day returns' },
                  { icon: Check, text: 'In stock & ready to ship' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-secondary-300">
                    <feature.icon className="w-4 h-4 text-primary-400" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-secondary-700">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${product.reviews})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-secondary-400 hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <p className="text-secondary-300 text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-secondary-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="animate-fade-in">
                <div className="bg-secondary-800/50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-secondary-700 last:border-b-0">
                        <span className="text-secondary-400 font-medium">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in">
                {/* Review Summary */}
                <div className="bg-secondary-800/50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-5 h-5',
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-secondary-600'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-secondary-400">Based on {product.reviews} reviews</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                          <span className="text-secondary-400 text-sm w-8">{rating}★</span>
                          <div className="flex-1 bg-secondary-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${Math.random() * 80 + 10}%` }}
                            />
                          </div>
                          <span className="text-secondary-400 text-sm w-8">
                            {Math.floor(Math.random() * 200)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-secondary-800/50 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium">{review.user}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        'w-4 h-4',
                                        i < review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-secondary-600'
                                      )}
                                    />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-secondary-400 text-sm">{review.date}</span>
                          </div>
                          
                          <h5 className="text-white font-medium mb-2">{review.title}</h5>
                          <p className="text-secondary-300 mb-4">{review.comment}</p>
                          
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-secondary-400 hover:text-white transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center space-x-1 text-secondary-400 hover:text-white transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.slug}`}
                className="group bg-secondary-800/50 rounded-xl overflow-hidden hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {relatedProduct.salePrice ? (
                        <>
                          <span className="text-primary-400 font-bold">
                            {formatPrice(relatedProduct.salePrice)}
                          </span>
                          <span className="text-secondary-400 line-through text-sm">
                            {formatPrice(relatedProduct.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-white font-bold">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-secondary-300 text-sm">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
