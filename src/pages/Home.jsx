import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye,
  Zap,
  Shield,
  Truck,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn, formatPrice, calculateDiscount } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addItem } = useCart();

  // Fetch featured products and categories from backend
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Featured products
        const prodRes = await fetch('/api/products?featured=true');
        const prodData = await prodRes.json();
        setFeaturedProducts(prodData.products || []);

        // Categories
        const catRes = await fetch('/api/products/categories');
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      } catch {
        setFeaturedProducts([]);
        setCategories([]);
      }

      // Testimonials (mock or fetch from backend if available)
      setTestimonials([
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          rating: 5,
          comment: 'Amazing quality products and super fast delivery! Will definitely shop here again.',
          product: 'Wireless Headphones'
        },
        {
          id: 2,
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          rating: 5,
          comment: 'Great customer service and the products exceeded my expectations.',
          product: 'Smart Watch'
        },
        {
          id: 3,
          name: 'Emily Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 4,
          comment: 'Love the variety and quality. The shopping experience is seamless.',
          product: 'Running Shoes'
        }
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const heroSlides = [
    {
      title: 'Summer Sale',
      subtitle: 'Up to 70% Off',
      description: 'Discover amazing deals on your favorite products',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      cta: 'Shop Now',
      href: '/products'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Fresh & Trendy',
      description: 'Check out the latest products in our collection',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      cta: 'Explore',
      href: '/products?filter=new'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading amazing products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-transparent z-10" />
        <div 
          className="h-[600px] bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${heroSlides[0].image})` }}
        >
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
                  {heroSlides[0].title}
                  <span className="block text-primary-400">{heroSlides[0].subtitle}</span>
                </h1>
                <p className="text-xl text-secondary-200 mb-8 animate-slide-up">
                  {heroSlides[0].description}
                </p>
                <Link 
                  to={heroSlides[0].href}
                  className="btn btn-primary btn-xl group animate-bounce-subtle"
                >
                  <span>{heroSlides[0].cta}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: Award, title: 'Quality Guarantee', desc: 'Premium products' },
              { icon: Zap, title: 'Fast Delivery', desc: 'Same day shipping' }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-secondary-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-secondary-400 text-lg">
              Discover products across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.href || `/products/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative overflow-hidden rounded-2xl bg-secondary-800/50 hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-secondary-300 text-sm">{category.productCount} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured Products
              </h2>
              <p className="text-secondary-400 text-lg">
                Handpicked items just for you
              </p>
            </div>
            <Link 
              to="/products"
              className="btn btn-outline btn-md group hidden md:flex"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product._id || product.id}
                className="group bg-secondary-800/50 rounded-2xl overflow-hidden hover:bg-secondary-700/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || (product.images && product.images[0])}
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
                    <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <Heart className="w-4 h-4 text-secondary-600" />
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
                    onClick={() => addItem(product)}
                    className="w-full btn btn-primary btn-sm group"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            What Our Customers Say
          </h2>
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  'transition-all duration-500',
                  index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
              >
                <div className="bg-secondary-800/50 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-secondary-200 text-lg mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-secondary-400 text-sm">Purchased {testimonial.product}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Testimonial Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors duration-200',
                  index === currentSlide ? 'bg-primary-500' : 'bg-secondary-600'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Get exclusive deals and new product updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
            />
            <button className="btn bg-white text-primary-600 hover:bg-primary-50 btn-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
