import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Download, RotateCcw, Star,
  MessageCircle, Search, X
} from 'lucide-react';
import { cn, formatPrice } from '../utils';
import LoadingSpinner, { SkeletonLoader } from '../components/ui/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  const { token } = useContext(AuthContext);

  // Show success message after checkout
  const isSuccess = searchParams.get('success') === 'true';

  // Fetch orders from backend (paginated)
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/orders?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
          setTotalPages(data.pages || 1);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }
      setIsLoading(false);
    };
    if (token) loadOrders();
  }, [token, isSuccess, page]);

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
    const status = order.status || order.paymentStatus || '';
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesSearch = (order._id || order.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items || []).some(item => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // Pagination controls
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

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
              const status = order.status || order.paymentStatus || '';
              const StatusIcon = getStatusIcon(status);
              return (
                <div 
                  key={order._id || order.id}
                  className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-semibold">{order._id || order.id}</span>
                      </div>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium border',
                        getStatusColor(status)
                      )}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-secondary-400 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
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
                    {(order.items || []).map((item, idx) => (
                      <div key={item._id || item.id || idx} className="flex items-center space-x-4">
                        <img
                          src={item.image || item.images?.[0] || (item.product && item.product.image)}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name || (item.product && item.product.name)}</h4>
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
                    {status === 'shipped' && (
                      <button className="btn btn-ghost btn-sm">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </button>
                    )}
                    {status === 'delivered' && (
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
                    <button className="btn btn-primary btn-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            <span className="text-white font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setShowOrderDetail(false)}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
    </div>
  );
};

// Order Detail Modal Component
function OrderDetailModal({ order, onClose, getStatusColor }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-secondary-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <button
              onClick={onClose}
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
                  <span className="text-secondary-400">Order ID:</span> {order._id || order.id}
                </p>
                <p className="text-secondary-300">
                  <span className="text-secondary-400">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                </p>
                <p className="text-secondary-300">
                  <span className="text-secondary-400">Status:</span> 
                  <span className={cn(
                    'ml-2 px-2 py-1 rounded text-xs',
                    getStatusColor(order.status || order.paymentStatus)
                  )}>
                    {(order.status || order.paymentStatus || '').charAt(0).toUpperCase() + (order.status || order.paymentStatus || '').slice(1)}
                  </span>
                </p>
                <p className="text-secondary-300">
                  <span className="text-secondary-400">Total:</span> {formatPrice(order.total)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <p className="text-secondary-300">
                  <span className="text-secondary-400">Address:</span> {order.shippingInfo?.address || 'N/A'}
                </p>
                <p className="text-secondary-300">
                  <span className="text-secondary-400">Method:</span> {order.shippingInfo?.method || 'Standard Shipping'}
                </p>
                {order.shippingInfo?.trackingNumber && (
                  <p className="text-secondary-300">
                    <span className="text-secondary-400">Tracking:</span> {order.shippingInfo.trackingNumber}
                  </p>
                )}
                {order.shippingInfo?.estimatedDelivery && (
                  <p className="text-secondary-300">
                    <span className="text-secondary-400">Est. Delivery:</span> {order.shippingInfo.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Timeline (optional) */}
          {order.timeline && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {order.timeline.map((step, index) => (
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
          )}
          {/* Order Items */}
          <div>
            <h3 className="text-white font-semibold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={item._id || item.id || idx} className="flex items-center space-x-4 p-4 bg-secondary-700/30 rounded-lg">
                  <img
                    src={item.image || item.images?.[0] || (item.product && item.product.image)}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name || (item.product && item.product.name)}</h4>
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
  );
}

export default Orders;
