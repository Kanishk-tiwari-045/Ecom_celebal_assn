import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Package,
  Heart,
  Settings,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn, isValidEmail, isValidPhone, storage } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  });

  // Address data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      isDefault: true,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    {
      id: 2,
      type: 'work',
      isDefault: false,
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States'
    }
  ]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginNotifications: true
  });

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsNotifications: true,
    emailNotifications: true
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load from localStorage or use default data
      const savedProfile = storage.get('userProfile');
      if (savedProfile) {
        setProfileData(savedProfile);
      }
      
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    storage.set('userProfile', profileData);
    
    setIsEditing(false);
    setIsLoading(false);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to saved data
    const savedProfile = storage.get('userProfile');
    if (savedProfile) {
      setProfileData(savedProfile);
    }
  };

  const handlePasswordChange = async () => {
    const newErrors = {};
    
    if (!securitySettings.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!securitySettings.newPassword) newErrors.newPassword = 'New password is required';
    else if (securitySettings.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset password fields
    setSecuritySettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    setIsLoading(false);
    setErrors({});
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  if (isLoading && activeTab === 'profile') {
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
            Manage your account information and preferences
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

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-secondary-700">
                <h3 className="text-white font-medium mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">Orders</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">Wishlist</span>
                    <span className="text-white font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-400">Reviews</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                </div>
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
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-secondary-700"
                      />
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-secondary-400">{profileData.email}</p>
                      <p className="text-secondary-500 text-sm">Member since January 2024</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed',
                          errors.firstName && 'input-error'
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed',
                          errors.lastName && 'input-error'
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
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
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        disabled={!isEditing}
                        className={cn(
                          'input',
                          !isEditing && 'bg-secondary-700/30 cursor-not-allowed'
                        )}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white">Security Settings</h2>

                  {/* Change Password */}
                  <div className="bg-secondary-700/30 rounded-lg p-6">
                    <h3 className="text-white font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.currentPassword}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                            className={cn('input pr-10', errors.currentPassword && 'input-error')}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={securitySettings.newPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                          className={cn('input', errors.newPassword && 'input-error')}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && (
                          <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={securitySettings.confirmPassword}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                          className={cn('input', errors.confirmPassword && 'input-error')}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="btn btn-primary btn-md"
                      >
                        {isLoading ? (
                          <LoadingSpinner size="sm" color="white" />
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-secondary-700/30 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                        <p className="text-secondary-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-secondary-700/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-secondary-400 text-sm">
                            {key === 'orderUpdates' && 'Get notified about order status changes'}
                            {key === 'promotions' && 'Receive promotional offers and deals'}
                            {key === 'newsletter' && 'Weekly newsletter with new products'}
                            {key === 'smsNotifications' && 'SMS notifications for important updates'}
                            {key === 'emailNotifications' && 'Email notifications for account activity'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({ 
                              ...notificationSettings, 
                              [key]: e.target.checked 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-secondary-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other tabs can be implemented similarly */}
              {activeTab === 'addresses' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Saved Addresses</h2>
                    <button className="btn btn-primary btn-sm">
                      Add New Address
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 bg-secondary-700/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-white font-medium capitalize">{address.type}</h3>
                              {address.isDefault && (
                                <span className="badge bg-primary-500 text-white text-xs">Default</span>
                              )}
                            </div>
                            <p className="text-secondary-300 text-sm">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-secondary-300 text-sm">
                              {address.address}
                            </p>
                            <p className="text-secondary-300 text-sm">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-secondary-300 text-sm">
                              {address.country}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="btn btn-ghost btn-sm">Edit</button>
                            <button className="btn btn-ghost btn-sm text-red-400">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold text-white">Account Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary-700/30 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Language</h3>
                      <select className="input">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-secondary-700/30 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Currency</h3>
                      <select className="input">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="gbp">GBP (£)</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                      <p className="text-red-300 text-sm mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="btn bg-red-600 hover:bg-red-700 text-white btn-sm">
                        Delete Account
                      </button>
                    </div>
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
