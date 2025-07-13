import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Lock, ArrowLeft, Check, MapPin, User, Mail, Phone, Shield, Truck, Package, ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { cn, formatPrice, isValidEmail, isValidPhone } from '../utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useContext(AuthContext);
  
  const { 
    items, 
    itemCount, 
    subtotal, 
    tax, 
    shipping, 
    total, 
    discount,
    saveCartForPayment,
    restoreCartAfterPayment,
    clearCartAfterPayment
  } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [payuParams, setPayuParams] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isFirstOrder, setIsFirstOrder] = useState(true);
  const [skipShipping, setSkipShipping] = useState(false);

  // Form data with email prefill
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: localStorage.getItem('userEmail') || user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const payuFormRef = useRef(null);

  // Check if user has previous orders and load profile
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user || !token) return;

      try {
        // Check if user has previous orders
        const ordersRes = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ordersData = await ordersRes.json();
        
        if (ordersData.success && ordersData.orders && ordersData.orders.length > 0) {
          setIsFirstOrder(false);
          
          // Load user profile
          const profileRes = await fetch('/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          
          if (profileData.success && profileData.user) {
            setUserProfile(profileData.user);
            
            // If user has saved shipping info, prefill and skip shipping step
            if (profileData.user.shippingInfo) {
              setShippingInfo({
                ...profileData.user.shippingInfo,
                email: localStorage.getItem('userEmail') || user?.email || profileData.user.email
              });
              setSkipShipping(true);
              setCurrentStep(2); // Skip to payment step
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    checkUserProfile();
  }, [user, token]);

  // Store email in localStorage when user logs in
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem('userEmail', user.email);
      setShippingInfo(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  // In your Checkout.jsx - Update the useEffect for payment return
useEffect(() => {
  const paymentStatus = searchParams.get('status');
  const paymentSuccess = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  
  if (paymentStatus === 'success' || paymentSuccess === 'true') {
    // Payment successful - clear cart and redirect to success page
    clearCartAfterPayment();
    navigate(`/orders?success=true${orderId ? `&orderId=${orderId}` : ''}`);
  } else if (paymentStatus === 'failure') {
    // Payment failed - restore cart
    restoreCartAfterPayment();
    const error = searchParams.get('error') || 'Payment failed';
    setErrors({ payment: decodeURIComponent(error) });
  }
}, [searchParams, navigate, clearCartAfterPayment, restoreCartAfterPayment]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !searchParams.get('status')) {
      navigate('/cart');
    }
  }, [items.length, navigate, searchParams]);

  // Auto-submit PayU form
  useEffect(() => {
    if (payuParams && payuFormRef.current) {
      payuFormRef.current.submit();
    }
  }, [payuParams]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !skipShipping) {
      if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!isValidEmail(shippingInfo.email)) newErrors.email = 'Invalid email format';
      if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!isValidPhone(shippingInfo.phone)) newErrors.phone = 'Invalid phone number';
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
      if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
      if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (validateStep(currentStep)) {
      // Save shipping info to user profile on first order
      if (currentStep === 1 && isFirstOrder && !skipShipping) {
        await saveShippingInfoToProfile();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Save shipping info to user profile
  const saveShippingInfoToProfile = async () => {
    if (!user || !token) return;

    try {
      const profileUpdate = {
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        }
      };

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileUpdate)
      });
    } catch (error) {
      console.error('Error saving shipping info:', error);
    }
  };

  // PayU Payment Handler
  const handlePayUPayment = async () => {
    setIsProcessing(true);
    setErrors({});
    
    try {
      saveCartForPayment();
      
      // Create order in backend
      const orderPayload = {
        items: items.map(item => ({
          product: item._id || item.id,
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          image: item.image,
        })),
        shippingInfo,
        total: parseFloat(total) || 0,
        tax: parseFloat(tax) || 0,
        shipping: parseFloat(shipping) || 0,
        discount: parseFloat(discount) || 0,
        paymentStatus: 'pending',
        paymentMethod: 'PayU'
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload),
      });
      
      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.order) {
        setErrors({ payment: orderData.message || 'Failed to create order. Please try again.' });
        restoreCartAfterPayment();
        setIsProcessing(false);
        return;
      }

      // Initiate PayU payment
      const productInfo = items.map(item => item.name).join(', ').substring(0, 100);
      const payload = {
        txnid: orderData.order._id,
        amount: parseFloat(total).toFixed(2),
        productinfo: productInfo,
        firstname: shippingInfo.firstName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
      };

      const response = await fetch('/api/payments/payu/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.payuParams) {
        setPayuParams(data.payuParams);
      } else {
        setErrors({ payment: 'Failed to initiate payment. Please try again.' });
        restoreCartAfterPayment();
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setErrors({ payment: 'Payment initiation failed. Please try again.' });
      restoreCartAfterPayment();
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', description: 'Delivery information' },
    { number: 2, title: 'Payment', description: 'PayU / Google Pay / UPI' },
    { number: 3, title: 'Review', description: 'Order confirmation' }
  ];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Checkout
            </h1>
            <p className="text-secondary-400">
              Complete your order in {skipShipping ? steps.length - 1 : steps.length} easy steps
            </p>
          </div>
          <Link 
            to="/cart"
            className="btn btn-ghost btn-md group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Cart</span>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.filter((step, index) => !skipShipping || index !== 0).map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-700 text-secondary-400'
                  )}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      skipShipping && step.number > 1 ? step.number - 1 : step.number
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      currentStep >= step.number ? 'text-white' : 'text-secondary-400'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-secondary-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.filter((step, index) => !skipShipping || index !== 0).length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-4 transition-colors duration-300',
                    currentStep > step.number ? 'bg-green-500' : 'bg-secondary-700'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information (Skip if user has saved info) */}
            {currentStep === 1 && !skipShipping && (
              <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary-400" />
                  Shipping Information
                  {isFirstOrder && (
                    <span className="ml-2 text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                      This will be saved for future orders
                    </span>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className={cn('input', errors.firstName && 'input-error')}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className={cn('input', errors.lastName && 'input-error')}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className={cn('input', errors.email && 'input-error')}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className={cn('input', errors.phone && 'input-error')}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className={cn('input', errors.address && 'input-error')}
                      placeholder="Enter street address"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className={cn('input', errors.city && 'input-error')}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className={cn('input', errors.state && 'input-error')}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      className={cn('input', errors.zipCode && 'input-error')}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-300 mb-2">
                      Country
                    </label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="input"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary btn-lg"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm animate-slide-up">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary-400" />
                  Payment - UPI / Google Pay / PayU
                </h2>

                {/* Show saved shipping info for returning users */}
                {skipShipping && userProfile?.shippingInfo && (
                  <div className="mb-6 p-4 bg-secondary-700/30 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Shipping to:</h3>
                    <p className="text-secondary-300 text-sm">
                      {userProfile.shippingInfo.firstName} {userProfile.shippingInfo.lastName}<br />
                      {userProfile.shippingInfo.address}<br />
                      {userProfile.shippingInfo.city}, {userProfile.shippingInfo.state} {userProfile.shippingInfo.zipCode}
                    </p>
                    <button
                      onClick={() => {
                        setSkipShipping(false);
                        setCurrentStep(1);
                      }}
                      className="text-primary-400 text-sm hover:underline mt-2"
                    >
                      Change shipping address
                    </button>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="bg-secondary-700/30 rounded-lg p-6 text-center">
                    <p className="text-lg text-white mb-4">
                      You will be redirected to PayU to complete your payment using UPI, Google Pay, or any supported method.
                    </p>
                    <button
                      onClick={handlePayUPayment}
                      disabled={isProcessing}
                      className="btn btn-primary btn-lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" color="white" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          <span>Proceed to PayU</span>
                        </>
                      )}
                    </button>
                    {errors.payment && (
                      <p className="text-red-400 text-sm mt-4">{errors.payment}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  {!skipShipping && (
                    <button
                      onClick={handlePreviousStep}
                      className="btn btn-secondary btn-lg"
                    >
                      Back to Shipping
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Hidden PayU Form */}
            {payuParams && (
              <form
                ref={payuFormRef}
                action={payuParams.action}
                method="POST"
                style={{ display: 'none' }}
              >
                {Object.entries(payuParams).map(([key, value]) =>
                  key !== 'action' ? (
                    <input key={key} type="hidden" name={key} value={value} />
                  ) : null
                )}
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-secondary-300">
                  <span>Subtotal ({itemCount || 0} items)</span>
                  <span>{formatPrice(subtotal || 0)}</span>
                </div>
                {(discount || 0) > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-secondary-300">
                  <span>Tax</span>
                  <span>{formatPrice(tax || 0)}</span>
                </div>
                <div className="flex justify-between text-secondary-300">
                  <span>Shipping</span>
                  <span>{(shipping || 0) === 0 ? 'Free' : formatPrice(shipping || 0)}</span>
                </div>
                <div className="border-t border-secondary-700 pt-3">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-secondary-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Secure Checkout</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300 text-sm">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
