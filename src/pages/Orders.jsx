import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  RotateCcw,
  Star,
  MessageCircle,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { cn, formatPrice } from '../utils';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();

  // Check for success message from checkout
  const isSuccess = searchParams.get('success') === 'true';

  // Mock orders data - replace with real API
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockOrders = [
        {
          id: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 199.99,
          items: [
            {
              id: 1,
              name: 'Wireless Noise-Cancelling Headphones',
              price: 199.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
            }
          ],
          shipping: {
            address: '123 Main St, City, State 12345',
            method: 'Standard Shipping',
            trackingNumber: 'TRK123456789'
          },
          timeline: [
            { status: 'placed', date: '2024-01-15', time: '10:30 AM', completed: true },
            { status: 'confirmed', date: '2024-01-15', time: '11:15 AM', completed: true },
            { status: 'shipped', date: '2024-01-16', time: '2:45 PM', completed: true },
            { status: 'delivered', date: '2024-01-18', time: '4:20 PM', completed: true }
          ]
        },
        {
          id: 'ORD-2024-002',
          date: '2024-01-20',
          status: 'shipped',
          total: 89.99,
          items: [
            {
              id: 2,
              name: 'Minimalist Backpack',
              price: 69.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100'
            }
          ],
          shipping: {
            address: '456 Oak Ave, City, State 67890',
            method: 'Express Shipping',
            trackingNumber: 'TRK987654321',
            estimatedDelivery: '2024-01-22'
          },
          timeline: [
            { status: 'placed', date: '2024-01-20', time: '3:15 PM', completed: true },
            { status: 'confirmed', date: '2024-01-20', time: '3:45 PM', completed: true },
            { status: 'shipped', date: '2024-01-21', time: '9:30 AM', completed: true },
            { status: 'delivered', date: '2024-01-22', time: 'Estimated', completed: false }
          ]
        },
        {
          id: 'ORD-2024-003',
          date: '2024-01-25',
          status: 'processing',
          total: 149.99,
          items: [
            {
              id: 3,
              name: 'Smart Fitness Watch',
              price: 149.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
            }
          ],
          shipping: {
            address: '789 Pine St, City, State 54321',
            method: 'Standard Shipping'
          },
          timeline: [
            { status: 'placed', date: '2024-01-25', time: '1:20 PM', completed: true },
            { status: 'confirmed', date: '2024-01-25', time: '1:45 PM', completed: true },
            { status: 'shipped', date: 'Processing', time: '', completed: false },
            { status: 'delivered', date: 'Pending', time: '', completed: false }
          ]
        }
      ];

      // Add success order if coming from checkout
      if (isSuccess) {
        const successOrder = {
          id: 'ORD-2024-NEW',
          date: new Date().toISOString().split('T')[0],
          status: 'confirmed',
          total: 299.99,
          items: [
            {
              id: 1,
              name: 'Wireless Noise-Cancelling Headphones',
              price: 199.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
            }
          ],
          shipping: {
            address: 'Your shipping address',
            method: 'Standard Shipping'
          },
          timeline: [
            { status: 'placed', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString(), completed: true },
            { status: 'confirmed', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString(), completed: true },
            { status: 'shipped', date: 'Processing', time: '', completed: false },
            { status: 'delivered', date: 'Pending', time: '', completed: false }
          ]
        };
        mockOrders.unshift(successOrder);
      }

      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadOrders();
  }, [isSuccess]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'processing':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'confirmed':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-secondary-400 bg-secondary-500/10 border-secondary-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'processing':
        return Clock;
      case 'confirmed':
        return Package;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <SkeletonLoader variant="text" lines={2} />
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-xl p-6 animate-slide-up">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-green-400 font-semibold">Order Placed Successfully!</h3>
                <p className="text-green-300 text-sm">
                  Thank you for your purchase. You'll receive a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My Orders
          </h1>
          <p className="text-secondary-400">
            Track and manage your orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-secondary-800/50 border border-secondary-700 rounded-lg text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-secondary-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-secondary-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-secondary-400 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : "You haven't placed any orders yet"
              }
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div 
                  key={order.id}
                  className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-semibold">{order.id}</span>
                      </div>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        getStatusColor(order.status)
                      )}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-secondary-400 text-sm">{order.date}</p>
                      </div>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-secondary-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-primary-400 font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-secondary-700">
                    {order.status === 'shipped' && (
                      <button className="btn btn-ghost btn-sm">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <>
                        <button className="btn btn-ghost btn-sm">
                          <Star className="w-4 h-4 mr-2" />
                          Write Review
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Return Item
                        </button>
                      </>
                    )}
                    <button className="btn btn-ghost btn-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-secondary-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetail(false)}
                    className="p-2 text-secondary-400 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Order ID:</span> {selectedOrder.id}
                      </p>
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Date:</span> {selectedOrder.date}
                      </p>
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Status:</span> 
                        <span className={cn(
                          'ml-2 px-2 py-1 rounded text-xs',
                          getStatusColor(selectedOrder.status)
                        )}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </p>
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Total:</span> {formatPrice(selectedOrder.total)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">Shipping Information</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Address:</span> {selectedOrder.shipping.address}
                      </p>
                      <p className="text-secondary-300">
                        <span className="text-secondary-400">Method:</span> {selectedOrder.shipping.method}
                      </p>
                      {selectedOrder.shipping.trackingNumber && (
                        <p className="text-secondary-300">
                          <span className="text-secondary-400">Tracking:</span> {selectedOrder.shipping.trackingNumber}
                        </p>
                      )}
                      {selectedOrder.shipping.estimatedDelivery && (
                        <p className="text-secondary-300">
                          <span className="text-secondary-400">Est. Delivery:</span> {selectedOrder.shipping.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    {selectedOrder.timeline.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-secondary-700 text-secondary-400'
                        )}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            'font-medium',
                            step.completed ? 'text-white' : 'text-secondary-400'
                          )}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </p>
                          <p className="text-secondary-400 text-sm">
                            {step.date} {step.time && `at ${step.time}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-secondary-700/30 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-secondary-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-primary-400 font-semibold">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
