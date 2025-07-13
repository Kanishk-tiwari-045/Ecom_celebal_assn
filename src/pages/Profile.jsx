import React, { useState, useEffect, useContext } from 'react';
import {
  User,
  Edit3,
  Save,
  X,
  Package,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn, isValidEmail, isValidPhone } from '../utils';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';


const API_BASE = '/api/user';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Load user activity on mount
  useEffect(() => {
    const fetchUserActivity = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setProfileData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            state: data.user.state || '',
            zipCode: data.user.zipCode || '',
            country: data.user.country || ''
          });
          setWishlist(data.user.wishlist || []);
          setOrders(data.user.orders || []);
          setTransactions(data.user.transactions || []);
        }
      } catch (err) {
        setErrors({ global: 'Failed to load profile.' });
      }
      setIsLoading(false);
    };
    fetchUserActivity();
  }, []);

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.name.trim()) newErrors.name = 'Name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(profileData.email)) newErrors.email = 'Invalid email format';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!isValidPhone(profileData.phone)) newErrors.phone = 'Invalid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
      } else {
        setErrors({ global: data.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setErrors({ global: 'Failed to update profile.' });
    }
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || ''
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <LoadingSpinner size="xl" text="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Account Settings
          </h1>
          <p className="text-secondary-400">
            Manage your account information and activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm sticky top-8">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                      activeTab === tab.id
                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                        : 'text-secondary-300 hover:text-white hover:bg-secondary-700/50'
                    )}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="btn btn-primary btn-sm"
                        >
                          {isLoading ? (
                            <LoadingSpinner size="xs" color="white" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-ghost btn-sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=0D8ABC&color=fff`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-secondary-700"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{profileData.name}</h3>
                      <p className="text-secondary-400">{profileData.email}</p>
                      <p className="text-secondary-500 text-sm">Member since {user && user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed',
                          errors.name && 'input-error'
                        )}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed',
                          errors.email && 'input-error'
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed',
                          errors.phone && 'input-error'
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>
                  </div>
                  {errors.global && (
                    <div className="text-red-400 mt-2">{errors.global}</div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white mb-4">Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <p className="text-secondary-400">Your wishlist is empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item._id} className="p-4 bg-secondary-700/30 rounded-lg flex items-center space-x-4">
                          <img src={item.image || item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-secondary-400 text-sm">{item.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white mb-4">Order History</h2>
                  {orders.length === 0 ? (
                    <p className="text-secondary-400">No orders found.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="p-4 bg-secondary-700/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-secondary-400 text-sm">Order ID: {order._id}</div>
                            <div className={cn(
                              'px-3 py-1 rounded-full text-xs font-semibold',
                              order.paymentStatus === 'paid'
                                ? 'bg-green-500/20 text-green-400'
                                : order.paymentStatus === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            )}>
                              {order.paymentStatus}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {order.items.map((item) => (
                              <div key={item.product} className="flex items-center space-x-2">
                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded" />
                                <span className="text-white text-sm">{item.name} × {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-secondary-400 text-sm">
                            <span>Total: <span className="text-white font-semibold">₹{order.total}</span></span>
                            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white mb-4">Payment Transactions</h2>
                  {transactions.length === 0 ? (
                    <p className="text-secondary-400">No transactions found.</p>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((txn, idx) => (
                        <div key={idx} className="p-4 bg-secondary-700/30 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">Order: {txn.orderId}</div>
                            <div className="text-secondary-400 text-sm">{txn.paymentMethod}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">₹{txn.amount}</div>
                            <div className="text-secondary-400 text-xs">{new Date(txn.date).toLocaleString()}</div>
                          </div>
                          <div className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold ml-4',
                            txn.status === 'success'
                              ? 'bg-green-500/20 text-green-400'
                              : txn.status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          )}>
                            {txn.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                  <div className="p-4 bg-secondary-700/30 rounded-lg">
                    <p className="text-secondary-400 text-sm mb-4">
                      For password changes and notification preferences, please use the security and notifications sections.
                    </p>
                    <button className="btn bg-red-600 hover:bg-red-700 text-white btn-sm"
                    onClick={() => {
  logout();
  navigate('/login');
}}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
